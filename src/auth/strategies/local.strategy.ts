import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { TConfig } from 'src/config/config.types';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService<TConfig>,
    private authStrategy: AuthService,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<Partial<User>> {
    const user = await this.authStrategy.validateUser(username, password);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    return user;
  }
}
