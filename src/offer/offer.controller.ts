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
import { CreateOfferDto, DeleteOfferDto, UpdateOfferDto } from 'src/utils';
import { OfferService } from './offer.service';
@ApiTags('Offer')
@Controller('offer')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}
  @Post()
  @UseGuards(AuthGuard('user'))
  @ApiBearerAuth()
  create(@Body() createOfferDto: CreateOfferDto) {
    return this.offerService.create(createOfferDto);
  }

  @Get()
  findAll() {
    return this.offerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offerService.findOne(id);
  }

  @Patch('')
  @UseGuards(AuthGuard('user'))
  @ApiBearerAuth()
  update(@Body() updateOfferDto: UpdateOfferDto) {
    return this.offerService.update(updateOfferDto);
  }

  @Delete('')
  @UseGuards(AuthGuard('user'))
  @ApiBearerAuth()
  remove(@Body() deleteOfferDto: DeleteOfferDto) {
    return this.offerService.remove(deleteOfferDto);
  }
}
