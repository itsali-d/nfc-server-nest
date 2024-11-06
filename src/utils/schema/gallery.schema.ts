import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';

@Schema({ versionKey: false })
export class Gallery extends Document {
  @Prop({ type: String })
  image: string;
  @Prop({ type: Types.ObjectId, ref: User.name })
  userId: string;
  @Prop({ type: Number })
  createdAt: number;

  @Prop({ type: Number })
  updatedAt: number;
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);
