import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

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

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1, _id: 1 });
export { UserSchema };
