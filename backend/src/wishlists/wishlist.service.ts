import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWishListDto } from './dto/createWishList.dto';
import { WishList } from './entities/wishList.entity';
import { User } from '../users/entities/users.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { UpdateWishListDto } from './dto/updateWishList.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(WishList)
    private readonly wishListRepository: Repository<WishList>,
    private readonly wishesService: WishesService,
  ) {}

  async getWishLists(): Promise<WishList[]> {
    const wishLists = await this.wishListRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });
    return wishLists;
  }

  async createWishList(
    createWishListDto: CreateWishListDto,
    owner: User,
  ): Promise<WishList> {
    const wishes = await this.wishesService.findWIshes(
      createWishListDto.itemsId,
    );

    const filteredWishes = createWishListDto.itemsId.map((itemId) => {
      return wishes.find((wish) => wish.id === itemId);
    });

    delete createWishListDto.itemsId;
    return this.wishListRepository.save({
      ...createWishListDto,
      owner: owner,
      items: filteredWishes,
    });
  }

  async findwishListById(id: number): Promise<WishList> {
    const wishList = await this.wishListRepository.findOne({
      where: { id: id },
      relations: { owner: true, items: true },
    });
    if (!wishList) {
      throw new NotFoundException('Коллекции с таким id не существует');
    }
    delete wishList.owner.email;
    return wishList;
  }

  async updateWishList(
    userId: number,
    wishListId: number,
    updateWishListDto: UpdateWishListDto,
  ): Promise<WishList> {
    const wishList = await this.findwishListById(wishListId);

    if (!wishList) {
      throw new NotFoundException('Коллекции с таким id не существует');
    }
    if (wishList.owner.id !== userId) {
      throw new ForbiddenException(
        'Вы не можете редактировать чужие коллекции',
      );
    }

    const wishes = await this.wishesService.findWIshes(
      updateWishListDto.itemsId,
    );
    const filteredWishes = updateWishListDto.itemsId.map((itemId) => {
      return wishes.find((wish) => wish.id === itemId);
    });

    const updatedWishlistItems = [...wishList.items, ...filteredWishes];

    delete updateWishListDto.itemsId;

    return this.wishListRepository.save({
      ...wishList,
      ...updateWishListDto,
      items: updatedWishlistItems,
    });
  }

  async deleteWishList(id: number, userId: number) {
    const wishList = await this.findwishListById(id);
    if (wishList.owner.id !== userId) {
      throw new ForbiddenException('Вы не можете удалять чужие коллекции');
    }
    return this.wishListRepository.remove(wishList);
  }
}
