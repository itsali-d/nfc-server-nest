import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

export type OrgUserDocument = HydratedDocument<OrgUser>;
export enum Role {
    ADMIN = 'admin',
    MANAGER = 'manager',
}
@Schema({ versionKey: false })
export class OrgUser extends Document {
    @Prop()
    name: string;

    @Prop({ unique: true, required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: String, enum: Object.values(Role), required: true })
    role: string;
    @Prop({ default: false })
    isDisable: boolean;

    @Prop({ default: false })
    isOnline: boolean;

    @Prop({ type: Number })
    createdAt: number;

    @Prop({ type: Number })
    updatedAt: number;

    @Prop({ type: Boolean, default: false })
    verified: boolean;
}

export const OrgUserSchema =
    SchemaFactory.createForClass(OrgUser);
