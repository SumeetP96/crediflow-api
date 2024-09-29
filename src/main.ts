import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { TConfig } from './config/config.types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<TConfig>);

  app.use(helmet());

  app.enableCors({
    origin: configService.get('clientOrigin'),
    credentials: true,
  });

  app.use(cookieParser());

  await app.listen(configService.get('port'));
}
bootstrap();
