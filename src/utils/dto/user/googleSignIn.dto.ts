import { ApiProperty } from '@nestjs/swagger';

export class GoogleSignInDto {
  @ApiProperty()
  idToken: string;
}
