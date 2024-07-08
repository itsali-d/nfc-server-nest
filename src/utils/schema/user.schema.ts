import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
@Schema()
export class SocialMedia {
  @Prop({ type: String })
  link: string;
  @Prop({ type: String })
  name: string;
  @Prop({ type: String })
  icon: string;
}
@Schema()
export class User extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  image: string;

  @Prop({ type: String })
  phoneNumber: string;

  @Prop({ type: String })
  countryCode: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String })
  nationality: string;

  @Prop({ type: [Types.ObjectId], ref: User.name })
  contacts: Types.ObjectId[];
  @Prop({ type: [SocialMedia] })
  socialMedia: SocialMedia[];
  @Prop({ type: String, unique: true })
  userId: string;

  @Prop({ type: Number })
  createdAt: number;

  @Prop({ type: Number })
  updatedAt: number;

  //   @Prop({ type: Boolean, default: false })
  //   verified: boolean;
}
export const UserSchema = SchemaFactory.createForClass(User);
