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
import { RolesGuard } from '../guards/role.guard';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { UpdateComDto } from './dto/updateCom.dto';
import { ComplaintADto } from './dto/complaintA.dto';
import { GetComStatusDto } from './dto/getComStatus.dto';
import { Roles } from 'src/decorator/role.decorator';

@Controller('complaint')
export class ComplaintController {
  constructor(private complaintService: ComplaintService) {}

  /// create complaint
  @Roles(false)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Serialize(ComplaintDto)
  async createCom(
    @Body() complaint: CreateComDto,
    user: mongoose.Schema.Types.ObjectId,
  ) {
    return await this.complaintService.createC(complaint, user);
  }

  //find complaint by user id
  @Roles(false)
  @Get('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Serialize(ComplaintDto)
  async findAll(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return await this.complaintService.findAll(id);
  }

  //update status
  @Roles(true)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/:userId/comp/:id')
  @Serialize(ComplaintADto)
  async updateC(
    @Param('id') id: string,
    @Param('userId') userId: mongoose.Schema.Types.ObjectId,
    @Body() body: UpdateComDto,
  ) {
    return await this.complaintService.updateS(id, userId, body.status);
  }

  ///get all complaints sorting+grouping+filtering
  @Roles(true)
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllC(@Query(ValidationPipe) filterStatus: GetComStatusDto) {
    return await this.complaintService.getAllCF2(filterStatus);
  }
}
