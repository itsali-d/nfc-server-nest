import { PartialType } from '@nestjs/swagger';
import { CreateGalleryDto } from './createGallery.dto';

export class UpdateGalleryDto extends PartialType(CreateGalleryDto) {}
