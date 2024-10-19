import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ versionKey: false })
export class Review extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  reviewFrom: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  reviewTo: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String })
  comment: string;
  @Prop({ type: Number })
  rating: number;
  @Prop({ type: Number })
  createdAt: number;

  @Prop({ type: Number })
  updatedAt: number;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
