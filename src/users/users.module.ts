import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { UserTransformService } from './services/user-transform.service';
import { UsersService } from './services/users.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';

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
