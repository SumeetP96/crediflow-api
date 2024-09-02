import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.model';
import { UsersService } from 'src/users/users.service';
import { UtilsProvider } from 'src/utils/utils.provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly utilsProvider: UtilsProvider,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    plainTextPassword: string,
  ): Promise<User> {
    const user = await this.userService.findByUsername(username);
    if (user) {
      const dbUser = user.toJSON();
      const isValid = await this.utilsProvider.bcrypt.checkPassword(
        plainTextPassword,
        dbUser.password,
      );
      if (isValid) {
        return dbUser;
      }
    }
  }

  async signIn(user: User): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
