import { ApiProperty } from '@nestjs/swagger';

export enum UserType {
  PERSONAL = 'PERSONAL',
  BUSINESS = 'BUSINESS',
}

export class UpdateUserDto {
  @ApiProperty({ type: String, required: true })
  name: string;
  @ApiProperty({ type: String })
  dateOfBirth: string;
  @ApiProperty({ type: String })
  cover: string;
  @ApiProperty({ type: String, enum: UserType })
  _type: UserType;
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
  @ApiProperty({ type: String })
  category: string;
}
