import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { SignUpUserDto } from './signUpUser.dto';

export class LoginUserDto extends PartialType(SignUpUserDto) {
  @ApiProperty()
  @IsNotEmpty()
  email: string;
  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  password: string;
}
