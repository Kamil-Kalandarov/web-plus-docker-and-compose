import { Controller, Get, CACHE_MANAGER, Inject, Header } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Get()
  async getHello(): Promise<any> {
    /* нужно получить уникальный ключ, так как кэш смотрим на ключи, а не на результат вызова функции */
    const cacheKey = 'hello1';
    const cachedData = await this.cache.get(cacheKey);
    if (cachedData) {
      return {
        data: cachedData,
        FromRedis: 'this is loaded from redis cache',
      };
    } else {
      const result = this.appService.getHello();
      await this.cache.set(cacheKey, result, 10000);
      return result;
    }
  }
}
