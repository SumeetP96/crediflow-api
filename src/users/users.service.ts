import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions } from 'sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  findAll(options?: FindOptions): Promise<User[]> {
    return this.userModel.findAll(options);
  }

  findById(id: number) {
    return this.userModel.findByPk(id);
  }

  findByUsername(username: string): Promise<User> {
    return this.userModel.findOne({
      where: { username },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userModel.update(updateUserDto, {
      where: { id },
    });
  }

  softDelete(id: number) {
    return this.userModel.update(
      { status: 'deleted', deletedAt: new Date() },
      { where: { id } },
    );
  }
}
