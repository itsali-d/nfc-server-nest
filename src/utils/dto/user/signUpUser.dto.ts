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
  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String, required: true })
  password: string;
}
