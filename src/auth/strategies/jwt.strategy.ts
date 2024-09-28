import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TConfig } from 'src/config/config.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService<TConfig>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (req && req.cookies) {
            return req.cookies[configService.get('authCookie')];
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwtSecret'),
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      username: payload.username,
    };
  }
}
