import { IsEnum, isNotEmpty, IsNotEmpty } from 'class-validator';
import { Status } from '../complaint.model';

export class UpdateComDto {
  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;
}
