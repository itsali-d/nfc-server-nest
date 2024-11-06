import { ApiProperty } from '@nestjs/swagger';

export class CreateOfferDto {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  image: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  price: string;
  @ApiProperty()
  link: string;
}
