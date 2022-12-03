import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from 'src/auth/user.model';
import { Complaint, Status } from './complaint.model';
import { CreateComDto } from './dto/createCom.dto';
import { GetComStatusDto } from './dto/getComStatus.dto';

@Injectable()
export class ComplaintService {
  constructor(
    @InjectModel('complaint') private complaintModel: Model<Complaint>,
    @InjectModel('user') private readonly userModel: Model<User>,
  ) {}

  //create complaint for client only
  async createC(
    complaint: CreateComDto,
    user: mongoose.Schema.Types.ObjectId,
  ): Promise<Complaint> {
    const checkuser = await this.userModel.findOne({ id: user });
    if (!checkuser) {
      throw new NotFoundException('user not found');
    }
    const newComp = await new this.complaintModel(complaint, user);
    return newComp.save();
  }

  //get complaint by user id for client only
  async findAll(id: mongoose.Schema.Types.ObjectId): Promise<Complaint[]> {
    const checkuser = await this.userModel.findById(id);
    if (!checkuser) {
      throw new NotFoundException('user not found');
    }
    const complaint = await this.complaintModel.find({ user: id });
    if (!complaint) {
      throw new NotFoundException('complaint not found');
    }
    return complaint;
  }

  //update status in complaint admin only
  async updateS(
    id: string,
    userId: mongoose.Schema.Types.ObjectId,
    stts: Status,
  ): Promise<string> {
    const checkUser = await this.userModel.findById(userId);
    if (!checkUser) {
      throw new NotFoundException('user not found');
    }
    const checkComp = this.complaintModel.findOne({
      _id: id,
      user: userId,
    });
    console.log(checkComp);
    if (!checkComp) {
      throw new NotFoundException('complaint not found');
    }

    const updated = await this.complaintModel.updateOne(checkComp, {
      status: stts,
    });

    return 'updated to ' + stts;
  }

  //get by filter for admin+group+sort
  async getAllCF2(filterS: GetComStatusDto): Promise<Complaint[]> {
    const { status } = filterS;

    const grp = await this.complaintModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $sort: {
          createdDate: -1,
        },
      },
      {
        $match: {
          ...(status ? { status: status } : {}),
        },
      },
      {
        $group: {
          _id: null,
          vip: {
            $push: {
              $cond: [
                {
                  $eq: ['$user.isVip', true],
                },
                '$$ROOT',
                '$$REMOVE',
              ],
            },
          },
          novip: {
            $push: {
              $cond: [
                {
                  $eq: ['$user.isVip', false],
                },
                '$$ROOT',
                '$$REMOVE',
              ],
            },
          },
        },
      },
    ]);

    return grp;
  }
}
