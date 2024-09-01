import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

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
