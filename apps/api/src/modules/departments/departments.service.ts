import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import {
  buildPaginationMeta,
  getSkip,
  Paginated,
} from '../../common/utils/pagination.util';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

/** Field eksplisit yang dikembalikan (hindari overfetch). */
const DEPARTMENT_SELECT = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.DepartmentSelect;

export type DepartmentView = Prisma.DepartmentGetPayload<{
  select: typeof DEPARTMENT_SELECT;
}>;

@Injectable()
export class DepartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Buat departemen baru; nama wajib unik. */
  async create(dto: CreateDepartmentDto): Promise<DepartmentView> {
    await this.ensureNameAvailable(dto.name);
    try {
      return await this.prisma.department.create({
        data: { name: dto.name, description: dto.description },
        select: DEPARTMENT_SELECT,
      });
    } catch (error) {
      // Backstop kalau nama bentrok dengan baris soft-deleted (unique di DB).
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Nama departemen sudah digunakan');
      }
      throw error;
    }
  }

  /** Daftar departemen ter-paginasi (mengecualikan yang sudah dihapus). */
  async findAll(query: PaginationQueryDto): Promise<Paginated<DepartmentView>> {
    const { page, limit } = query;
    const where: Prisma.DepartmentWhereInput = { deletedAt: null };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.department.findMany({
        where,
        select: DEPARTMENT_SELECT,
        skip: getSkip(page, limit),
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.department.count({ where }),
    ]);

    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  /** Ambil satu departemen aktif. */
  async findOne(id: string): Promise<DepartmentView> {
    const department = await this.prisma.department.findFirst({
      where: { id, deletedAt: null },
      select: DEPARTMENT_SELECT,
    });
    if (!department) {
      throw new NotFoundException('Departemen tidak ditemukan');
    }
    return department;
  }

  /** Update departemen; cek unik nama jika diganti. */
  async update(
    id: string,
    dto: UpdateDepartmentDto,
  ): Promise<DepartmentView> {
    await this.findOne(id);
    if (dto.name) {
      await this.ensureNameAvailable(dto.name, id);
    }
    return this.prisma.department.update({
      where: { id },
      data: dto,
      select: DEPARTMENT_SELECT,
    });
  }

  /**
   * Safe delete: soft-delete dengan men-set deletedAt agar relasi user
   * yang masih mereferensikan departemen tidak rusak.
   */
  async remove(id: string): Promise<{ id: string; deleted: true }> {
    await this.findOne(id);
    await this.prisma.department.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: { id: true },
    });
    return { id, deleted: true };
  }

  /**
   * Pastikan nama belum dipakai departemen aktif lain.
   * `exceptId` dipakai saat update agar tidak bentrok dengan dirinya sendiri.
   */
  private async ensureNameAvailable(
    name: string,
    exceptId?: string,
  ): Promise<void> {
    const existing = await this.prisma.department.findFirst({
      where: {
        name,
        deletedAt: null,
        ...(exceptId ? { id: { not: exceptId } } : {}),
      },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException('Nama departemen sudah digunakan');
    }
  }
}
