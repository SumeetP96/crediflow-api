import { Injectable } from '@nestjs/common';
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { User } from '../entities/user.entity';
import { ITransformedUser } from '../user.types';

@Injectable()
export class UserTransformService {
  constructor(private readonly utilsProvider: UtilsProvider) {}

  transform(user: User): ITransformedUser {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  transformedSuccessResponse(user: User, message?: string) {
    return this.utilsProvider.responseBuilder.success<ITransformedUser>(
      this.transform(user),
      message,
    );
  }

  transformedErrorResponse(user: User, message?: string) {
    return this.utilsProvider.responseBuilder.error<ITransformedUser>(
      this.transform(user),
      message,
    );
  }
}
