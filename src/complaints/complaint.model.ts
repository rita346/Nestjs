import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, mongo } from 'mongoose';
import { User } from 'src/auth/user.model';

export type ComplaintDocument = Complaint & Document;

export enum Status {
  Pending = 'pending',
  Inprogress = 'inprogress',
  Resolved = 'resolved',
  Rejected = 'rejected',
}

export interface IComplaint {
  id: string;
  title: string;
  body: string;
  status: Status;
  user: User;
  createdDate: Date;
}

@Schema()
export class Complaint {
  @Prop()
  title: string;

  @Prop()
  body: string;

  @Prop({ default: Status.Pending })
  status: Status;

  @Prop({ default: Date.now() })
  createdDate: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' }) // @Type(() => User)
  user: User;
}
export const ComplaintSchema = SchemaFactory.createForClass(Complaint);
