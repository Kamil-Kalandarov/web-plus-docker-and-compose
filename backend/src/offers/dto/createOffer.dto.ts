import { IsBoolean, IsPositive } from 'class-validator';

export class CreateOfferDto {
  itemId: number;

  @IsPositive()
  amount: number;

  @IsBoolean()
  hidden: boolean;
}
