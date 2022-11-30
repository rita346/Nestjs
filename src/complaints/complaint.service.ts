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
  async createC(complaint: CreateComDto, user: mongoose.Schema.Types.ObjectId) {
    const checkuser = await this.userModel.findOne({ id: user });
    if (!checkuser) {
      throw new NotFoundException('user not found');
    }
    const newComp = await new this.complaintModel(complaint, user);
    return newComp.save();
  }

  /*
  //create complaint  (2nd method) for client only
  async createU(complaint: CreateComDto) {
    const usercheck = await this.userModel.findById(complaint.user);
    if (!usercheck) {
      throw new NotFoundException('user not found ');
    }
    const newComp = await new this.complaintModel(complaint);
    return newComp.save();
  }
*/

  //get complaint by user id for client only
  async findAll(id: mongoose.Schema.Types.ObjectId) {
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
  ) {
    const checkUser = await this.userModel.findById(userId);
    if (!checkUser) {
      throw new NotFoundException('user not found');
    }
    const checkComp = this.complaintModel.find({
      _id: id,
      user: userId,
    });
    if (!checkComp) {
      throw new NotFoundException('complaint not found');
    }
    //const updated = this.complaintModel.findOneAndUpdate(checkComp, stts);
    const updated = await this.complaintModel.updateOne({ status: stts });
    return 'updated to ' + stts;
  }

  //get by filter for admin+group+sort
  async getAllCF2(filterS: GetComStatusDto) {
    const { status } = filterS;

    const grps = await this.complaintModel
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
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
          $facet: {
            vip: [
              {
                $match: {
                  'user.isVip': true,
                },
              },
            ],
            nonVip: [
              {
                $match: {
                  'user.isVip': false,
                },
              },
            ],
          },
        },
      ])
      .project({
        'vip._id': 0,
        'vip.__v': 0,
        'nonVip._id': 0,
        'nonVip.nonvip._id': 0,
        'vip.user.password': 0,
        'vip.user._id': 0,
        'vip.user.isVip': 0,
        'vip.user.isAdmin': 0,
        'vip.user.createdDate': 0,
        'vip.user.__v': 0,
        'nonVip.user.password': 0,
        'nonVip.user._id': 0,
        'nonVip.user.isVip': 0,
        'nonVip.user.isAdmin': 0,
        'nonVip.user.createdDate': 0,
        'nonVip.user.__v': 0,
        'nonVip.__v': 0,
      });

    return grps;
  }

  // 2nd method for get all complaints

  /*
  //get all complaints with descending sort(by createdDate) for admin without filtering status
  async getAllC2() {
    return await this.complaintModel
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },

        {
          $sort: {
            createdDate: -1,
          },
        },
        {
          $facet: {
            vip: [
              {
                $match: {
                  'user.isVip': true,
                },
              },
            ],
            nonVip: [
              {
                $match: {
                  'user.isVip': false,
                },
              },
            ],
          },
        },
      ])
      .project({
        'vip._id': 0,
        'vip.__v': 0,
        'nonVip._id': 0,
        'nonVip.nonvip._id': 0,
        'vip.user.password': 0,
        'vip.user._id': 0,
        'vip.user.isVip': 0,
        'vip.user.isAdmin': 0,
        'vip.user.createdDate': 0,
        'vip.user.__v': 0,
        'nonVip.user.password': 0,
        'nonVip.user._id': 0,
        'nonVip.user.isVip': 0,
        'nonVip.user.isAdmin': 0,
        'nonVip.user.createdDate': 0,
        'nonVip.user.__v': 0,
        'nonVip.__v': 0,
      });
  }

  //with filter+group+sorting
  async getAllCF(filterS: GetComStatusDto) {
    const { status } = filterS;

    const grps = await this.complaintModel
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },

        {
          $sort: {
            createdDate: -1,
          },
        },
        {
          $match: {
            status: status,
          },
        },
        {
          $facet: {
            vip: [
              {
                $match: {
                  'user.isVip': true,
                },
              },
            ],
            nonVip: [
              {
                $match: {
                  'user.isVip': false,
                },
              },
            ],
          },
        },
      ])
      .project({
        'vip._id': 0,
        'vip.__v': 0,
        'nonVip._id': 0,
        'nonVip.nonvip._id': 0,
        'vip.user.password': 0,
        'vip.user._id': 0,
        'vip.user.isVip': 0,
        'vip.user.isAdmin': 0,
        'vip.user.createdDate': 0,
        'vip.user.__v': 0,
        'nonVip.user.password': 0,
        'nonVip.user._id': 0,
        'nonVip.user.isVip': 0,
        'nonVip.user.isAdmin': 0,
        'nonVip.user.createdDate': 0,
        'nonVip.user.__v': 0,
        'nonVip.__v': 0,
      });

    return grps;
  }
*/
}
