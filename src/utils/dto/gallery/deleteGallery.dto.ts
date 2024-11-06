import { ApiProperty } from '@nestjs/swagger';

export class DeleteGalleryDto {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  _id: string;
}
