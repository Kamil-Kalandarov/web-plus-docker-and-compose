import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwtGuard';
import { Offer } from './entities/offers.entity';
import { CreateOfferDto } from './dto/createOffer.dto';
import { OffersService } from './offers.service';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  createOffer(
    @Req() request,
    @Body() createOfferDto: CreateOfferDto,
  ): Promise<Offer> {
    return this.offersService.creteOffer(request.user, createOfferDto);
  }

  @Get()
  GetAllOffers(): Promise<Offer[]> {
    return this.offersService.getAllOffers();
  }
}
