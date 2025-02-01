import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsIn(['10d', '6m', '1y'])
  @IsNotEmpty()
  expiresIn: '10d' | '6m' | '1y';
}
