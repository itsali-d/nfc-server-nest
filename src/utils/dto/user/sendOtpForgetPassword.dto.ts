import { ApiProperty } from "@nestjs/swagger";

export class SendOtpForgetPasswordDto {
  @ApiProperty()
  email: string;
}
