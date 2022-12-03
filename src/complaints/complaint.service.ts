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
      {
        $project: {
          _id: 0,
          'vip.__v': 0,
          'vip._id': 0,
          'vip.user._id': 0,
          'vip.user.password': 0,
          'vip.user.isVip': 0,
          'vip.user.isAdmin': 0,
          'vip.user.createdDate': 0,
          'vip.user.__v': 0,
          'novip.__v': 0,
          'novip._id': 0,
          'novip.user._id': 0,
          'novip.user.password': 0,
          'novip.user.isVip': 0,
          'novip.user.isAdmin': 0,
          'novip.user.createdDate': 0,
          'novip.user.__v': 0,
        },
      },
    ]);

    return grp;
  }
}
