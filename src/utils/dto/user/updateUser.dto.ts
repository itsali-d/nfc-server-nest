import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { SignUpUserDto } from './signUpUser.dto';

export class UpdateUserDto extends PartialType(SignUpUserDto) {}
