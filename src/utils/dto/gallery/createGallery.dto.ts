import { ApiProperty } from '@nestjs/swagger';

export class CreateGalleryDto {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  image: string;
  @ApiProperty()
  caption: string;
}
