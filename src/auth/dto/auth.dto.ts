import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'securePassword123', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: '10d',
    description: 'Token expiration time',
    enum: ['10d', '6m', '1y'],
  })
  @IsIn(['10d', '6m', '1y'])
  @IsNotEmpty()
  expiresIn: '10d' | '6m' | '1y';
}
