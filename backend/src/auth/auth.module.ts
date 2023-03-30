import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { HashModule } from '../hash/hash.module';
import { TokenModule } from './token/token.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStartegy } from './strategies/jwt.strategy';

@Module({
  imports: [UsersModule, HashModule, TokenModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStartegy],
})
export class AuthModule {}
