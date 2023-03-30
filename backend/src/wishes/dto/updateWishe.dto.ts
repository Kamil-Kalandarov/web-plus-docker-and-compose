import { IsNumber, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateWishDto {
  @IsString()
  @IsOptional()
  @Length(1, 250)
  name: string;

  @IsUrl()
  @IsOptional()
  link: string;

  @IsUrl()
  @IsOptional()
  image: string;

  @IsOptional()
  price: number;

  @IsString()
  @IsOptional()
  @Length(1, 1024)
  description: string;

  @IsNumber()
  @IsOptional()
  raised: number;
}
