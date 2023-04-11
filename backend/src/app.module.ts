import { Module, CacheModule } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";
import * as Joi from "joi";
import type { ClientOpts } from "redis";
import redisStore from "cache-manager-redis-store";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { AppController } from "./app.controller";
import { UsersModule } from "./users/users.module";
import { AppService } from "./app.service";
import configuration from "./configuration";
import { WishesModule } from "./wishes/wishes.module";
import { OffersModule } from "./offers/offers.module";
import { WishlistsModule } from "./wishlists/wishlists.module";
import { HashModule } from "./hash/hash.module";
import { AuthModule } from "./auth/auth.module";
import { TokenModule } from "./auth/token/token.module";

const shcema = Joi.object({
  port: Joi.number().integer().default(4000),
  database: Joi.object({
    host: Joi.string()
      .pattern(/postgres:\/\/[a-zA-Z]/)
      .required(),
    port: Joi.number().integer().required(),
    username: Joi.string(),
    password: Joi.string(),
  }),
});

@Module({
  imports: [
    /* 
      получение данныйх из файла конфигурации для App 
      делаем его глобальным
      присваиваем схему для данных подлкючения к БД
    */
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      validationSchema: shcema,
    }),
    /* 
      ПОДКЛЮЧЕНИЕ БД К ПРИЛОЖЕНЮ 
      (используется forRootAsync для того чтобы первым загрузилось приложение, а только потом БД)
      передаем AppService для получения данных для подключения к БД
      импорт ConfigModule, так как AppService зависит от него
    */
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: AppService,
    }),
    UsersModule,
    WishesModule,
    OffersModule,
    WishlistsModule,
    HashModule,
    AuthModule,
    TokenModule,
    /* ПОДКЛЮЧЕНИЕ БД-REDIS ДЛЯ ХРАНЕНИЯ КЭША */
    CacheModule.registerAsync<ClientOpts>({
      useFactory: async () => {
        return {
          store: redisStore,
          host: "localhost",
          port: 6379,
        };
      },
    }),
    /* НАСТРОЙКИ ПРИОРИТЕТА ДЛЯ ЛОЕГГЕРА WINSTON */
    WinstonModule.forRoot({
      levels: {
        critical_error: 0,
        error: 1,
        special_warning: 2,
        another_log_level: 3,
        info: 4,
      },
      transports: [
        new winston.transports.Console({ format: winston.format.simple() }),
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "request.log" }),
      ],
    }),
    /* ЗАЩИТА ОТ DDOS АТАК (ограничение косличества запросов до 10 в минуту) */
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
