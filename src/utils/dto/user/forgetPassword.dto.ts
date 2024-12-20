import { ApiProperty, PartialType } from '@nestjs/swagger';
import { VerifyOtpDto } from './verifyOtp.dto';

export class ForgetPasswordDto extends PartialType(VerifyOtpDto) {
  @ApiProperty()
  password: string;
  @ApiProperty()
  otp: number;
  @ApiProperty()
  email: string;
}
