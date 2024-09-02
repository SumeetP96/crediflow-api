import { Injectable } from '@nestjs/common';
import { User } from './entities/user.model';

@Injectable()
export class TransformUserService {
  transformUser(user: User) {
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      status: user.status,
    };
  }
}
