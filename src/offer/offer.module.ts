import { Module } from '@nestjs/common';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  JwtStrategyUser,
  Offer,
  OfferSchema,
  User,
  UserSchema,
} from 'src/utils';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Offer.name, schema: OfferSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [OfferController],
  providers: [OfferService, JwtStrategyUser],
})
export class OfferModule {}
