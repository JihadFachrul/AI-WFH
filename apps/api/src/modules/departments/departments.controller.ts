import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

/**
 * Mutasi departemen = admin-only (ADMIN/SUPER_ADMIN).
 * Baca departemen = MANAGER ke atas. Otorisasi ditegakkan oleh RolesGuard.
 */
@Controller('departments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  /** POST /api/departments — admin-only route example. */
  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  create(@Body() dto: CreateDepartmentDto) {
    return this.departmentsService.create(dto);
  }

  /** GET /api/departments — list ter-paginasi. */
  @Get()
  @Roles(UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  findAll(@Query() query: PaginationQueryDto) {
    return this.departmentsService.findAll(query);
  }

  /** GET /api/departments/:id */
  @Get(':id')
  @Roles(UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.departmentsService.findOne(id);
  }

  /** PATCH /api/departments/:id — admin-only. */
  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateDepartmentDto,
  ) {
    return this.departmentsService.update(id, dto);
  }

  /** DELETE /api/departments/:id — admin-only, soft delete. */
  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.departmentsService.remove(id);
  }
}
