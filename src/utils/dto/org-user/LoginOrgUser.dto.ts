import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateOrgUserDto } from './createOrgUser.dto';

export class LoginUserDto extends PartialType(CreateOrgUserDto) {
  @ApiProperty({ example: 'user1@gmail.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  password: string;
}
