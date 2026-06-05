import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

/**
 * Key metadata yang dibaca oleh RolesGuard via Reflector.
 */
export const ROLES_KEY = 'roles';

/**
 * @Roles(...) menempelkan daftar role yang diizinkan ke handler/controller.
 * Authorization sebenarnya dilakukan oleh RolesGuard, bukan di controller.
 *
 * Contoh: @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
