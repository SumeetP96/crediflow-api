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
import { UtilsProvider } from 'src/common/utils/utils.provider';
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
    private readonly utilsProvider: UtilsProvider,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe({ body: createUserSchema }))
  @UseFilters(AllExceptionsFilter)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userTransformService.transformedSuccessResponse(
      await this.usersService.create(createUserDto),
      'User created',
    );
  }

  @Get()
  @UseFilters(AllExceptionsFilter)
  async findAll() {
    const data = await this.usersService.findAll({
      attributes: { exclude: ['password'] },
    });
    return this.utilsProvider.responseBuilder.success(data);
  }

  @Get(':id')
  @UseFilters(AllExceptionsFilter)
  async findById(@Param('id') id: number) {
    return this.userTransformService.transformedSuccessResponse(
      await this.usersService.findById(id),
    );
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe({ body: updateUserSchema }))
  @UseFilters(AllExceptionsFilter)
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userTransformService.transformedSuccessResponse(
      await this.usersService.update(id, updateUserDto),
      'User updated',
    );
  }

  @Delete(':id')
  @UseFilters(AllExceptionsFilter)
  async delete(@Param('id') id: number) {
    return this.userTransformService.transformedSuccessResponse(
      await this.usersService.delete(id),
      'User deleted',
    );
  }

  @Post('restore/:id')
  @UseFilters(AllExceptionsFilter)
  async restore(@Param('id') id: number) {
    return this.userTransformService.transformedSuccessResponse(
      await this.usersService.restore(id),
      'User restored',
    );
  }
}
