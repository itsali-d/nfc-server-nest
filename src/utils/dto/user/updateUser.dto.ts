import { PartialType } from '@nestjs/mapped-types';
import { SignUpUserDto } from './signUpUser.dto';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsOptional, ValidateIf } from 'class-validator';
export enum UserType {
  PERSONAL = 'PERSONAL',
  BUSINESS = 'BUSINESS',
}
export enum CategoryType {
  RESTAURANT = 'RESTAURANT',
  MEDICAL_CARE = 'MEDICAL_CARE',
  HOTEL = 'HOTEL',
}
export class UpdateUserDto {
  @ApiProperty({ type: String, required: true })
  name: string;
  @ApiProperty({ type: String })
  dateOfBirth: string;
  @ApiProperty({ type: String, enum: UserType })
  type: UserType;
  @ApiProperty({ type: String })
  city: string;
  @ApiProperty({ type: String })
  whatsappBusiness: string;

  @ApiProperty({ type: String })
  phoneNumber: string;

  @ApiProperty({ type: String })
  profilePic: string;
  @ApiProperty({ type: String })
  bio: string;
  @ApiProperty({ type: String, enum: CategoryType })
  category: CategoryType;
}
