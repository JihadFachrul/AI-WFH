import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

/**
 * UsersModule meng-export UsersService (dipakai AuthModule) dan
 * mendaftarkan UsersController untuk endpoint user management.
 */
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
