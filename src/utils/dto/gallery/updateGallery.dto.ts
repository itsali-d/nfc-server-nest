import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateGalleryDto } from './createGallery.dto';

export class UpdateGalleryDto extends PartialType(CreateGalleryDto) {
    @ApiProperty()
    _id: string;
}
