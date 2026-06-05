import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import {
  buildPaginationMeta,
  getSkip,
  Paginated,
} from '../../common/utils/pagination.util';
import type { AuthUser } from '../auth/strategies/jwt.strategy';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const BCRYPT_SALT_ROUNDS = 10;

/**
 * Field aman yang boleh dikembalikan ke client.
 * `password` SENGAJA tidak dipilih agar tidak pernah bocor (no overfetch).
 */
const SAFE_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  departmentId: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export type SafeUser = Prisma.UserGetPayload<{
  select: typeof SAFE_USER_SELECT;
}>;

/** Role yang boleh membaca/melihat user lain. */
const USER_READERS: UserRole[] = [
  UserRole.MANAGER,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
];

/** Role yang boleh mengelola (update) user lain. */
const USER_MANAGERS: UserRole[] = [UserRole.ADMIN, UserRole.SUPER_ADMIN];

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================================
  // Dipakai oleh AuthService / JwtStrategy (internal, boleh ada password)
  // ============================================================

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  // ============================================================
  // User management (safe select, no password)
  // ============================================================

  /**
   * Admin membuat user baru: cegah duplikat email, hash password, simpan.
   * Otorisasi (ADMIN/SUPER_ADMIN) ditegakkan oleh RolesGuard di controller.
   */
  async createUser(dto: CreateUserDto): Promise<SafeUser> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException('Email sudah terdaftar');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);

    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: passwordHash,
        role: dto.role,
        departmentId: dto.departmentId,
      },
      select: SAFE_USER_SELECT,
    });
  }

  /** Profil milik user yang sedang login. */
  async findMe(userId: string): Promise<SafeUser> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: SAFE_USER_SELECT,
    });
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }
    return user;
  }

  /**
   * Daftar user dengan pagination + search (name/email) + filter (role,
   * departmentId). Data & total diambil dalam satu transaksi (hindari N+1).
   */
  async findAll(query: QueryUsersDto): Promise<Paginated<SafeUser>> {
    const { page, limit, search, role, departmentId } = query;

    const where: Prisma.UserWhereInput = {
      deletedAt: null,
      ...(role ? { role } : {}),
      ...(departmentId ? { departmentId } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        select: SAFE_USER_SELECT,
        skip: getSkip(page, limit),
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  /**
   * Ambil satu user. EMPLOYEE hanya boleh mengakses profilnya sendiri;
   * MANAGER/ADMIN/SUPER_ADMIN boleh mengakses siapa saja.
   */
  async findOne(id: string, requester: AuthUser): Promise<SafeUser> {
    this.assertCanRead(id, requester);

    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: SAFE_USER_SELECT,
    });
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }
    return user;
  }

  /**
   * Update user.
   * - name/email: pemilik profil atau admin.
   * - role/departmentId/isActive: ADMIN/SUPER_ADMIN saja (admin administration).
   */
  async update(
    id: string,
    dto: UpdateUserDto,
    requester: AuthUser,
  ): Promise<SafeUser> {
    const isAdmin = USER_MANAGERS.includes(requester.role as UserRole);
    const isOwner = requester.id === id;
    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('Anda hanya dapat mengubah profil sendiri');
    }

    const touchesPrivileged =
      dto.role !== undefined ||
      dto.departmentId !== undefined ||
      dto.isActive !== undefined;
    if (touchesPrivileged && !isAdmin) {
      throw new ForbiddenException(
        'Hanya admin yang dapat mengubah role, department, atau status',
      );
    }

    const existing = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('User tidak ditemukan');
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data: dto,
        select: SAFE_USER_SELECT,
      });
    } catch (error) {
      // Unique constraint (mis. email sudah dipakai user lain)
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email sudah digunakan');
      }
      throw error;
    }
  }

  // ============================================================
  // Authorization helpers (business logic, bukan di controller)
  // ============================================================

  private assertCanRead(targetId: string, requester: AuthUser): void {
    const isPrivileged = USER_READERS.includes(requester.role as UserRole);
    const isOwner = requester.id === targetId;
    if (!isPrivileged && !isOwner) {
      throw new ForbiddenException('Anda hanya dapat mengakses profil sendiri');
    }
  }
}
