import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';
import { UserSchema } from 'src/auth/user.model';
import { ComplaintController } from './complaint.controller';
import { ComplaintSchema } from './complaint.model';
import { ComplaintService } from './complaint.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'complaint', schema: ComplaintSchema }]),
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
  ],
  controllers: [ComplaintController],
  providers: [ComplaintService],
})
export class ComplaintModule {}
