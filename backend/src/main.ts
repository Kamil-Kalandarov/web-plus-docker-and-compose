import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as etag from 'etag';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  /* настройка кэширования на клиенте. Deafault - слабый Etag(только семантические изменения) */
  app.set('etag', etag);
  /* глобальное подключение логгера winston */
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  /* создаем экземпляр класса ConfigService, чтобы получить доступ к файлу configuration.ts */
  const configService = app.get(ConfigService);
  /* получаем номер порта из файла configuration.ts */
  const port = configService.get('port');
  /* подключаем cookieParser для хранения ключа для чтения файла сессии для корректной работы csurf */
  app.use(cookieParser());
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );
  /* CORS, CSP и др. заголовки */
  app.use(helmet());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await app.listen(port);
}
bootstrap();
