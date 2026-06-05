import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService membungkus PrismaClient sebagai provider NestJS.
 * Lifecycle hook NestJS dipakai untuk connect/disconnect ke database.
 * Gunakan service ini di semua module (jangan instantiate PrismaClient baru).
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
