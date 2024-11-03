import { ApiProperty, PartialType } from '@nestjs/swagger';
import { VerifyOtpDto } from './verifyOtp.dto';

export class VerifyOtpForgetPasswordDto extends PartialType(VerifyOtpDto) {
  @ApiProperty()
  email: string;
}
