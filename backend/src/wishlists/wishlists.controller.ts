import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwtGuard';
import { CreateWishListDto } from './dto/createWishList.dto';
import { UpdateWishListDto } from './dto/updateWishList.dto';
import { WishList } from './entities/wishList.entity';
import { WishlistsService } from './wishlist.service';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistController {
  constructor(private readonly wishListsService: WishlistsService) {}

  @Get()
  getWishLists(): Promise<WishList[]> {
    return this.wishListsService.getWishLists();
  }

  @Post()
  createWishList(
    @Body() createWishListDto: CreateWishListDto,
    @Req() request,
  ): Promise<WishList> {
    return this.wishListsService.createWishList(
      createWishListDto,
      request.user,
    );
  }

  @Get(':id')
  getWishListById(id: number): Promise<WishList> {
    return this.wishListsService.findwishListById(id);
  }

  @Patch(':id')
  updateWishListById(
    @Req() request,
    id: number,
    @Body() updateWishListDto: UpdateWishListDto,
  ): Promise<WishList> {
    return this.wishListsService.updateWishList(
      request.user.id,
      id,
      updateWishListDto,
    );
  }

  @Delete(':id')
  deleteWIshList(@Param('id') id: number, @Req() request) {
    return this.wishListsService.deleteWishList(id, request.user.id);
  }
}
