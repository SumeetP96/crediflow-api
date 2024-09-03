import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  RestoreOptions,
  UpdateOptions,
} from 'sequelize';
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private readonly utilsProvider: UtilsProvider,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    options?: CreateOptions,
  ): Promise<User> {
    createUserDto.password = await this.utilsProvider.bcrypt.hashPassword(
      createUserDto.password,
    );
    return await this.userModel.create(createUserDto, options);
  }

  async findAll(options?: FindOptions): Promise<User[]> {
    return await this.userModel.findAll(options);
  }

  async findById(id: number): Promise<User> {
    return await this.userModel.findByPk(id);
  }

  async findByUsername(username: string): Promise<User> {
    return await this.userModel.findOne({
      where: { username },
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    options?: UpdateOptions,
  ): Promise<User> {
    await this.userModel.update(updateUserDto, {
      where: { id },
      ...(options || {}),
    });
    return await this.findById(id);
  }

  async delete(id: number, options?: DestroyOptions): Promise<User> {
    const user = await this.findById(id);
    await this.userModel.destroy({
      where: { id },
      ...(options || {}),
    });
    return user;
  }

  async restore(id: number, options?: RestoreOptions): Promise<User> {
    await this.userModel.restore({
      where: { id },
      ...(options || {}),
    });
    return await this.findById(id);
  }
}
