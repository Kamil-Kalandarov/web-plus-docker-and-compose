import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishList } from './entities/wishList.entity';
import { WishlistController } from './wishlists.controller';
import { WishlistsService } from './wishlist.service';
import { WishesModule } from '../wishes/wishes.module';

@Module({
  imports: [TypeOrmModule.forFeature([WishList]), WishesModule],
  controllers: [WishlistController],
  providers: [WishlistsService],
})
export class WishlistsModule {}
