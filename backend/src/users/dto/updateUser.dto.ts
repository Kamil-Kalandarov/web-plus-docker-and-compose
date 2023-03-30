import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 30)
  username: string;

  @IsOptional()
  @IsString()
  @Length(2, 200)
  about: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  avatar?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  password: string;
}
