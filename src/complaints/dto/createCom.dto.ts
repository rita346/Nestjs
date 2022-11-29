import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateComDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsNotEmpty()
  user: mongoose.Schema.Types.ObjectId;
}
