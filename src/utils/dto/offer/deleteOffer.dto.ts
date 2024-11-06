import { ApiProperty } from '@nestjs/swagger';

export class DeleteOfferDto {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  _id: string;
}
