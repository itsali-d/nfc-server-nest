import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Gallery,
  GallerySchema,
  Offer,
  OfferSchema,
  Review,
  ReviewSchema,
  User,
  UserSchema,
} from 'src/utils';
import { JwtStrategyUser } from 'src/utils/strategies/userJwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: Gallery.name, schema: GallerySchema },
      { name: Offer.name, schema: OfferSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategyUser],
})
export class UserModule {}
