import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/Login.dto';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';

@Controller()
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return user;
  }

  @UseGuards(LocalStrategy)
  @Post('signin')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.login(loginDto);
    return user;
  }
}
