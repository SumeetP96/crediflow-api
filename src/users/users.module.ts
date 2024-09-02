import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UtilsProvider } from 'src/utils/utils.provider';
import { User } from './entities/user.model';
import { UserTransformService } from './user-transform.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserTransformService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    UtilsProvider,
  ],
  exports: [UsersService, UserTransformService],
})
export class UsersModule {}
