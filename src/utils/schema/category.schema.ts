import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

@Schema({ versionKey: false })
export class Category extends Document {
  @Prop({ type: String })
  icon: string;
  @Prop({ type: String })
  name: string;
  @Prop({ type: Number })
  createdAt: number;

  @Prop({ type: Number })
  updatedAt: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
