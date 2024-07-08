import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { SignUpUserDto } from './signUpUser.dto';

export class LoginUserDto extends PartialType(SignUpUserDto) {
  @ApiProperty({ example: '334405887' })
  @IsNotEmpty()
  phoneNumber: string;
  @ApiProperty({ example: '+971' })
  @IsNotEmpty()
  countryCode: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  password: string;
}