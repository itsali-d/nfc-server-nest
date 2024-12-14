import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from './category.schema';
import { UserType } from '../dto';
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
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  dateOfBirth: string;
  @Prop({ type: String, unique: true, required: true })
  email: string;
  @Prop()
  otpCode: number;
  @Prop()
  forgetPasswordOtp: number;
  @Prop({ type: String, enum: UserType })
  _type: UserType;
  @Prop({ type: String })
  cover: string;
  @Prop({ type: String })
  city: string;
  @Prop({ type: String })
  whatsappBusiness: string;

  @Prop({ type: String })
  phoneNumber: string;

  @Prop({ type: String })
  profilePic: string;
  @Prop({ type: String })
  bio: string;
  @Prop({ type: Types.ObjectId, ref: Category.name })
  category: Types.ObjectId;

  @Prop({ type: String })
  password: string;

  @Prop({ type: Number })
  rating: number;
  @Prop({ type: [Types.ObjectId], ref: User.name })
  contacts: Types.ObjectId[];
  @Prop({ type: [SocialMedia] })
  socialMedia: SocialMedia[];

  @Prop({ type: Boolean, default: false })
  verified: boolean;
  @Prop({ type: Boolean, default: false })
  forgetPassword: boolean;
  @Prop({ type: Number })
  createdAt: number;

  @Prop({ type: Number })
  updatedAt: number;

  //   @Prop({ type: Boolean, default: false })
  //   verified: boolean;
}
export const UserSchema = SchemaFactory.createForClass(User);
