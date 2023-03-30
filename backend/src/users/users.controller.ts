import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Wish } from '../wishes/entities/wishes.entity';
import { WishesService } from '../wishes/wishes.service';
import { JwtGuard } from '../auth/guards/jwtGuard';
import { userRequestType } from '../utils/userRequestType';
import { FindUserDto } from './dto/findUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly wisheService: WishesService,
  ) {}

  @Get('me')
  async getOwnUser(@Req() request: userRequestType): Promise<User> {
    const user = await this.userService.findUserByUserName(
      request.user.username,
    );
    delete user.password;
    return user;
  }

  @Get(':username')
  async getUserByName(@Param('username') username: string): Promise<User> {
    const user = await this.userService.findUserByUserName(username);
    return user;
  }

  @Get('me/wishes')
  async getOwnWishes(@Req() request): Promise<Wish[]> {
    const user = await this.userService.findUserByUserName(
      request.user.username,
    );
    delete user.password;
    return this.wisheService.getWishes(user.id);
  }

  @Patch('me')
  updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: userRequestType,
  ): Promise<User> {
    const userId = request.user.id;
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Get(':username/wishes')
  async getSomeUserWishes(
    @Param('username') username: string,
  ): Promise<Wish[]> {
    const user = await this.userService.findUserByUserName(username);
    return this.wisheService.getWishes(user.id);
  }

  @Post('find')
  findByNamerOrEmail(@Body() findUserDto: FindUserDto): Promise<User> {
    return this.userService.findMany(findUserDto.query);
  }
}
