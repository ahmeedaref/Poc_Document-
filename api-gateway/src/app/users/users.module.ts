import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './repositories/users.repository';
import { PrismaUsersRepository } from './repositories/prisma-users.repository';
import { UserSyncGuard } from './user-sync.guard';
@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    UserSyncGuard,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
