import { Request } from 'express';
import { User } from 'src/users/user.entity';

export interface JwtParsedUser {
  id: number;
  username: string;
}

export interface RequestWithJwtParsedUser extends Partial<Request> {
  user: JwtParsedUser;
}

export interface RequestWithDbUser extends Partial<Request> {
  user: User;
}
