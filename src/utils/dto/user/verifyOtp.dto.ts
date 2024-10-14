import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty()
  otp: number;
  @ApiProperty()
  isVerification: boolean;
}
