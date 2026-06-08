import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'user', description: 'Username for login' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: 'pass123', description: 'Password for login' })
  @IsString()
  @MinLength(6)
  password: string;
}
