import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.enableCors({
    origin: '*',
  });

  app.use(cookieParser());

  const configService = app.get(ConfigService);

  await app.listen(configService.get('port'));
}
bootstrap();
