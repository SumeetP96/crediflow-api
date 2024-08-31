import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { UtilsProvider } from 'src/utils/utils.provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly utilsProvider: UtilsProvider,
    private userService: UsersService,
  ) {}

  async signIn(username: string, plainTextPassword: string): Promise<User> {
    const user = await this.userService.findByUsername(username);
    if (!user || !user?.password) {
      throw new UnauthorizedException();
    }
    const isValid = await this.utilsProvider.bcrypt.checkPassword(
      plainTextPassword,
      user.password,
    );
    if (!isValid) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
