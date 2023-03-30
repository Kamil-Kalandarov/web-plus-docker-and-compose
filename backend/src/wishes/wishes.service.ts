import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/createWish.dto';
import { UpdateWishDto } from './dto/updateWishe.dto';
import { Wish } from './entities/wishes.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepositiry: Repository<Wish>,
  ) {}

  async getWishes(userId: number): Promise<Wish[]> {
    const userWishes = await this.wishRepositiry.find({
      where: { owner: { id: userId } },
      relations: {
        owner: true,
        offers: true,
      },
    });
    return userWishes;
  }

  async createWish(createWishDto: CreateWishDto, owner: User): Promise<Wish> {
    return this.wishRepositiry.save({ ...createWishDto, owner });
  }

  async findLastWishes(): Promise<Wish[]> {
    const wishes = await this.wishRepositiry.find({
      relations: {
        owner: true,
        offers: true,
      },
      order: { id: 'DESC' },
      take: 40,
    });
    return wishes;
  }

  async findTopWishes(): Promise<Wish[]> {
    const wishes = await this.wishRepositiry.find({
      relations: {
        owner: true,
        offers: true,
      },
      order: { id: 'DESC' },
      take: 20,
    });
    return wishes;
  }

  async findWisheById(id: number): Promise<Wish> {
    const wish = await this.wishRepositiry.findOne({
      where: { id: id },
      relations: {
        owner: true,
        offers: true,
      },
    });
    if (!wish) {
      throw new NotFoundException('Подарка с таким id не существует');
    }
    return wish;
  }

  async updateWish(id: number, updateWishDto: UpdateWishDto) {
    const wish = await this.findWisheById(id);
    return this.wishRepositiry.save({ ...wish, ...updateWishDto });
  }

  async deleteWish(id: number, userId: number) {
    const wish = await this.findWisheById(id);
    if (!wish) {
      throw new NotFoundException('Подарка с таким id не существует');
    }
    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Вы не можете удалять чужой подарок');
    }
    if (wish.offers.length !== 0) {
      throw new ForbiddenException(
        'Удалять подарок, на который уже внесли деньги другие пользователи нельзя',
      );
    }
    await this.wishRepositiry.delete(id);
    return wish;
  }

  async addToOwnWishList(id: number, owner: User): Promise<Wish> {
    const wish = await this.findWisheById(id);
    if (!wish) {
      throw new NotFoundException('Подарка с таким id не существует');
    }
    const clonedWishDto = {
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
      copied: wish.copied + 1,
    };
    const clonedWish = await this.wishRepositiry.save({
      ...clonedWishDto,
      owner,
    });
    return clonedWish;
  }

  findWIshes(query): Promise<Wish[]> {
    return this.wishRepositiry.find(query);
  }
}
