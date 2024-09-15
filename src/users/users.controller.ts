import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { AllExceptionsFilter } from 'src/common/exception-filters/all-exception.filter';
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { ZodValidationPipe } from 'src/common/validation-pipes/zod-validation.pipe';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto';
import {
  FindAllUsersQuery,
  findAllUsersSchema,
} from './dto/find-all-users-query-dto';
import { UpdateUserDto, updateUserSchema } from './dto/update-user.dto';
import { UserTransformService } from './services/user-transform.service';
import { UsersService } from './services/users.service';

@UseFilters(AllExceptionsFilter)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userTransformService: UserTransformService,
    private readonly utilsProvider: UtilsProvider,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe({ body: createUserSchema }))
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userTransformService.transformedSuccessResponse(
      await this.usersService.create(createUserDto),
      'User created',
    );
  }

  @UsePipes(new ZodValidationPipe({ query: findAllUsersSchema }))
  @Get()
  async findAll(@Query() query: FindAllUsersQuery) {
    return this.utilsProvider.responseBuilder.success(
      await this.usersService.findAllWithCount(query),
    );
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.userTransformService.transformedSuccessResponse(
      await this.usersService.findById(id),
    );
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe({ body: updateUserSchema }))
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userTransformService.transformedSuccessResponse(
      await this.usersService.update(id, updateUserDto),
      'User updated',
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.userTransformService.transformedSuccessResponse(
      await this.usersService.delete(id),
      'User deleted',
    );
  }

  @Post('restore/:id')
  async restore(@Param('id') id: number) {
    return this.userTransformService.transformedSuccessResponse(
      await this.usersService.restore(id),
      'User restored',
    );
  }
}
