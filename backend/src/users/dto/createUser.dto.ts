import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 30)
  username: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @Length(2, 200)
  about: string;

  @IsNotEmpty()
  @IsOptional()
  @IsUrl()
  avatar: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
