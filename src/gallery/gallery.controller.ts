import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateGalleryDto, DeleteGalleryDto, UpdateGalleryDto } from 'src/utils';
import { GalleryService } from './gallery.service';
@ApiTags('Gallery')
@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  create(@Body() createGalleryDto: CreateGalleryDto) {
    return this.galleryService.create(createGalleryDto);
  }

//   @Get()
//   findAll() {
//     return this.galleryService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.galleryService.findOne(id);
//   }

  @Patch('')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  update(@Body() updateGalleryDto: UpdateGalleryDto) {
    return this.galleryService.update(updateGalleryDto);
  }

  @Delete('')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  remove(@Body() deleteGalleryDto: DeleteGalleryDto) {
    return this.galleryService.remove(deleteGalleryDto);
  }
}
