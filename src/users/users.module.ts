import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { User } from './entities/user.entity';
import { UserTransformService } from './services/user-transform.service';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UserTransformService, UtilsProvider],
  exports: [UsersService, UserTransformService],
})
export class UsersModule {}
