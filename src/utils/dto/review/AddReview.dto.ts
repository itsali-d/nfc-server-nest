import { ApiProperty } from '@nestjs/swagger';

export class AddReviewDto {
  @ApiProperty()
  reviewFrom: string;

  @ApiProperty()
  reviewTo: string;

  @ApiProperty()
  comment: string;
  @ApiProperty()
  rating: number;
 
}
