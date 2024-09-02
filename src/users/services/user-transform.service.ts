import { Injectable } from '@nestjs/common';
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { User } from '../user.entity';

@Injectable()
export class UserTransformService {
  constructor(private readonly utilsProvider: UtilsProvider) {}

  transform(user: User) {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }

  transformedSuccessResponse(user: User, message?: string) {
    return this.utilsProvider.responseBuilder.success(
      this.transform(user),
      message,
    );
  }

  transformedErrorResponse(user: User, message?: string) {
    return this.utilsProvider.responseBuilder.error(
      this.transform(user),
      message,
    );
  }
}
