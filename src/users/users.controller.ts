import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { AllExceptionsFilter } from 'src/common/exception-filters/all-exception.filter';
import { ZodValidationPipe } from 'src/common/validation-pipes/zod-validation.pipe';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto';
import { UpdateUserDto, updateUserSchema } from './dto/update-user.dto';
import { UserTransformService } from './services/user-transform.service';
import { UsersService } from './services/users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userTransformService: UserTransformService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe({ body: createUserSchema }))
  @UseFilters(AllExceptionsFilter)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userTransformService.transform(
      await this.usersService.create(createUserDto),
    );
  }

  @Get()
  @UseFilters(AllExceptionsFilter)
  async findAll() {
    return await this.usersService.findAll({
      attributes: { exclude: ['password'] },
    });
  }

  @Get(':id')
  @UseFilters(AllExceptionsFilter)
  async findOne(@Param('id') id: number) {
    return this.userTransformService.transform(
      await this.usersService.findById(id),
    );
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe({ body: updateUserSchema }))
  @UseFilters(AllExceptionsFilter)
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseFilters(AllExceptionsFilter)
  async softDelete(@Param('id') id: number) {
    return await this.usersService.softDelete(id);
  }
}
