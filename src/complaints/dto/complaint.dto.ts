import { Expose } from 'class-transformer';
import mongoose from 'mongoose';
import { Status } from '../complaint.model';

export class ComplaintDto {
  @Expose()
  title: string;

  @Expose()
  body: string;

  @Expose()
  status: Status;

  @Expose()
  user: mongoose.Schema.Types.ObjectId;
}
