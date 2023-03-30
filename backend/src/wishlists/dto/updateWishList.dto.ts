import { IsArray, IsString, IsUrl } from 'class-validator';

export class UpdateWishListDto {
  @IsString()
  name: string;

  @IsUrl()
  image: string;

  @IsArray()
  itemsId: number[];
}
