import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { CreateComDto } from './dto/createCom.dto';
import mongoose from 'mongoose';
import { Serialize } from 'src/interceptor/serialize.interceptor';
import { ComplaintDto } from './dto/complaint.dto';
import { TestGuardC } from '../guards/role.guard';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { UpdateComDto } from './dto/updateCom.dto';
import { ComplaintADto } from './dto/complaintA.dto';
import { GetComStatusDto } from './dto/getComStatus.dto';
import { ClientGuard } from 'src/guards/client.guard';

@Controller('complaint')
export class ComplaintController {
  constructor(private complaintService: ComplaintService) {}

  /// create complaint
  @UseGuards(JwtAuthGuard, ClientGuard)
  @Post()
  @Serialize(ComplaintDto)
  async createCom(
    @Body() complaint: CreateComDto,
    user: mongoose.Schema.Types.ObjectId,
  ) {
    return await this.complaintService.createC(complaint, user);
  }

  /*
  //create complaint 2nd method
    @UseGuards(JwtAuthGuard, ClientGuard)
  @Post()
   @Serialize(ComplaintDto)
  async createComU(
    @Body() complaint: CreateComDto,
  ) {
    return await this.complaintService.createC(complaint);
  }
  */

  //find complaint by user id
  @UseGuards(JwtAuthGuard, ClientGuard)
  @Get('/:id')
  @Serialize(ComplaintDto)
  async findAll(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return await this.complaintService.findAll(id);
  }

  //update status
  @UseGuards(JwtAuthGuard, TestGuardC)
  @Patch('/:userId/comp/:id')
  @Serialize(ComplaintADto)
  async updateC(
    @Param('id') id: string,
    @Param('userId') userId: mongoose.Schema.Types.ObjectId,
    @Body() body: UpdateComDto,
  ) {
    return await this.complaintService.updateS(id, userId, body.status);
  }

  //get all complaints by filter
  @UseGuards(JwtAuthGuard, TestGuardC)
  @Get()
  async getAllC(@Query(ValidationPipe) filterStatus: GetComStatusDto) {
    if (Object.keys(filterStatus).length) {
      return await this.complaintService.getAllCF2(filterStatus);
    } else {
      return await this.complaintService.getAllC2();
    }
  }
}
