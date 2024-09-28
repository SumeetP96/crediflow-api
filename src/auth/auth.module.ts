import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { TConfig } from 'src/config/config.types';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<TConfig>) => ({
        secret: configService.get('jwtSecret'),
        signOptions: {
          expiresIn: configService.get('authExpiry'),
        },
      }),
      inject: [ConfigService<TConfig>],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, UtilsProvider],
})
export class AuthModule {}
