import { IsIn, IsOptional } from 'class-validator';
import { Status } from '../complaint.model';

export class GetComStatusDto {
  @IsOptional()
  @IsIn([Status.Inprogress, Status.Pending, Status.Rejected, Status.Resolved]) //check if value is an array allowed value
  status: Status;
}
