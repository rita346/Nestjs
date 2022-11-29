import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;
/*
export enum Role {
  Admin = 'admin',
  User = 'client',
}*/

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ default: false })
  isVip: boolean;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ default: Date.now() })
  createdDate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
