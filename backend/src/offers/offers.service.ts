import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WishesService } from '../wishes/wishes.service';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/createOffer.dto';
import { Offer } from './entities/offers.entity';
import { User } from '../users/entities/users.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepositiry: Repository<Offer>,
    private readonly wishesSevice: WishesService,
  ) {}

  async creteOffer(user: User, createOfferDto: CreateOfferDto): Promise<Offer> {
    const wish = await this.wishesSevice.findWisheById(createOfferDto.itemId);
    if (!wish) {
      throw new NotFoundException('Подарка с таким id не существует');
    }
    if (wish.owner.id === user.id) {
      throw new ForbiddenException(
        'Вносить деньги на собственный подарок невозможно',
      );
    }
    if (wish.raised + createOfferDto.amount > wish.price) {
      throw new ForbiddenException(
        'Сумма собранных средств не может превышать стоимость подарка',
      );
    }

    const offer = await this.offersRepositiry.create({
      ...createOfferDto,
      user: user,
      item: wish,
    });

    if (offer.hidden === true) {
      delete offer.user;
      return this.offersRepositiry.save(offer);
    }

    const newRised = wish.raised + createOfferDto.amount;
    await this.wishesSevice.updateWish(wish.id, {
      ...wish,
      raised: newRised,
    });
    return this.offersRepositiry.save(offer);
  }

  getAllOffers(): Promise<Offer[]> {
    return this.offersRepositiry.find({
      relations: { user: true, item: true },
    });
  }

  async getOfferById(id: number): Promise<Offer> {
    const offer = await this.offersRepositiry.findOne({
      where: { id: id },
      relations: { item: true, user: true },
    });
    if (!offer) {
      throw new NotFoundException('Оффера с таким id не существует');
    }
    return offer;
  }
}
