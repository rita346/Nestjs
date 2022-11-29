import { Expose } from 'class-transformer';
import { Status } from '../complaint.model';

export class ComplaintADto {
  @Expose()
  status: Status;
}
