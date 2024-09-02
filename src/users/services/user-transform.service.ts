import { Injectable } from '@nestjs/common';
import { User } from '../user.entity';

@Injectable()
export class UserTransformService {
  transform(user: User) {
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      status: user.status,
    };
  }
}
