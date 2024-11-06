import { Module } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Gallery,
  GallerySchema,
  JwtStrategyUser,
  User,
  UserSchema,
} from 'src/utils';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Gallery.name, schema: GallerySchema },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [GalleryService, JwtStrategyUser],
  controllers: [GalleryController],
})
export class GalleryModule {}
