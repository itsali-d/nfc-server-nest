import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsOptional, ValidateIf } from 'class-validator';

enum UserType {
  PERSONAL = 'PERSONAL',
  BUSINESS = 'BUSINESS',
}

class TimeRange {
  @ApiProperty({ type: String, example: '09:00' })
  open: string;
  @ApiProperty({ type: String, example: '17:00' })
  close: string;
}

class OpeningTime {
  @ApiProperty({ type: TimeRange })
  monday: TimeRange;

  @ApiProperty({ type: TimeRange })
  tuesday: TimeRange;

  @ApiProperty({ type: TimeRange })
  wednesday: TimeRange;

  @ApiProperty({ type: TimeRange })
  thursday: TimeRange;

  @ApiProperty({ type: TimeRange })
  friday: TimeRange;

  @ApiProperty({ type: TimeRange })
  saturday: TimeRange;

  @ApiProperty({ type: TimeRange })
  sunday: TimeRange;
}

export class SignUpUserDto {
  @ApiProperty({ type: String, required: true })
  name: string;
  @ApiProperty({ type: String })
  description: string;
  @ApiProperty({ type: String, enum: UserType })
  type: UserType;
  @ApiProperty({ type: String })
  image: string;
  @ApiProperty({ type: String })
  phoneNumber: string;
  @ApiProperty({ type: String })
  countryCode: string;
  @ApiProperty({ type: String, required: true })
  password: string;
  @ApiProperty({ type: String, required: true })
  nationality: string;
  @ApiHideProperty()
  userId: string;
  @ApiProperty({
    type: [String],
    required: false,
    description: 'Only required if type is BUSINESS',
  })
  @ValidateIf((o) => o.type === UserType.BUSINESS)
  @IsOptional()
  gallery?: string[];

  @ApiProperty({
    type: OpeningTime,
    required: false,
    description: 'Business opening times',
  })
  @ValidateIf((o) => o.type === UserType.BUSINESS)
  @IsOptional()
  openingTime?: OpeningTime;
}
