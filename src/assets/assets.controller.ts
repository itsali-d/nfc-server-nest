import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  UploadedFiles,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { DynamicAuthGuard } from 'src/utils/guards/dynamic-auth.guard';

@ApiTags('Assets')
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}
@ApiBearerAuth()
  // @UseGuards(DynamicAuthGuard(['jwt', 'user']))
  @Post('/upload')
  @ApiOperation({
    summary: 'Create Assets',
    description:
      'You should select the folder which is related to the user role, for example: player then the folder should be player.',
  })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: process.env.ASSETS_ADMIN,
        filename: (req: any, file: any, cb: any) => {
          cb(null, `${file.originalname}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: { type: 'array', items: { type: 'string', format: 'binary' } },
        // folder: { type: 'string', example: 'admin' },
      },
    },
  })
  create(@UploadedFiles() files) {
    return this.assetsService.create(files);
  }

  // @Get()
  // findAll() {
  //   return this.assetsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.assetsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
  //   return this.assetsService.update(+id, updateAssetDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.assetsService.remove(+id);
  // }
}
