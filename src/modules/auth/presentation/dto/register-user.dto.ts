import { IsString, MinLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ example: 'newuser', description: 'Username for registration' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: 'pass123', description: 'Password for registration' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john@email.com', description: 'Email address' })
  @IsEmail()
  email: string;
}
