import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class AppService implements TypeOrmOptionsFactory {
  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  /* получение объекта database из файла configuration.ts, для дальнейшей передачи его TypeOrmModule в app.module.ts */
  createTypeOrmOptions() {
    return this.configService.get('database');
  }
  getHello(): string {
    this.logger.log('info', 'I get hello');
    return 'Hello Nest.Js';
  }
}
