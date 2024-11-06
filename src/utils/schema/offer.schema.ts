import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';

@Schema({ versionKey: false })
export class Offer extends Document {
  @Prop({ type: String })
  image: string;
  @Prop({ type: String })
  title: string;
  @Prop({ type: String })
  price: string;
  @Prop({ type: String })
  link: string;
  @Prop({ type: Types.ObjectId, ref: User.name })
  userId: string;
  @Prop({ type: Number })
  createdAt: number;

  @Prop({ type: Number })
  updatedAt: number;
}

export const OfferSchema = SchemaFactory.createForClass(Offer);
