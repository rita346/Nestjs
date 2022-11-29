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

  //get all complaints with descending sort(by createdDate) for admin without filtering status
  async getAllC2() {
    return await this.complaintModel
      .aggregate()
      .lookup({
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      })
      .project({ __v: 0 })
      .sort({ createdDate: -1 })
      .facet({
        vip: [
          { $match: { 'user.isVip': true } },
          { $group: { _id: null, vip: { $push: '$$ROOT' } } },
        ],
        nonvip: [
          { $match: { 'user.isVip': false } },
          { $group: { _id: null, nonvip: { $push: '$$ROOT' } } },
        ],
      })
      .project({
        'vip.vip._id': 0,
        'vip._id': 0,
        'nonvip._id': 0,
        'nonvip.nonvip._id': 0,
        'vip.vip.user.password': 0,
        'vip.vip.user._id': 0,
        'vip.vip.user.isVip': 0,
        'vip.vip.user.isAdmin': 0,
        'vip.vip.user.createdDate': 0,
        'vip.vip.user.__v': 0,
        'nonvip.nonvip.user.password': 0,
        'nonvip.nonvip.user._id': 0,
        'nonvip.nonvip.user.isVip': 0,
        'nonvip.nonvip.user.isAdmin': 0,
        'nonvip.nonvip.user.createdDate': 0,
        'nonvip.nonvip.user.__v': 0,
      });
  }

  //get by filter for admin+group+sort
  async getAllCF2(filterS: GetComStatusDto) {
    const { status } = filterS;

    const groupComp1 = await this.complaintModel
      .aggregate()
      .lookup({
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      })
      .project({ __v: 0 })
      .match({ status: status })
      .sort({ createdDate: -1 })
      .facet({
        vip: [
          { $match: { 'user.isVip': true } },
          { $group: { _id: null, vip: { $push: '$$ROOT' } } },
        ],
        nonvip: [
          { $match: { 'user.isVip': false } },
          { $group: { _id: null, nonvip: { $push: '$$ROOT' } } },
        ],
      })
      .project({
        'vip.vip._id': 0,
        'vip._id': 0,
        'nonvip._id': 0,
        'nonvip.nonvip._id': 0,
        'vip.vip.user.password': 0,
        'vip.vip.user._id': 0,
        'vip.vip.user.isVip': 0,
        'vip.vip.user.isAdmin': 0,
        'vip.vip.user.createdDate': 0,
        'vip.vip.user.__v': 0,
        'nonvip.nonvip.user.password': 0,
        'nonvip.nonvip.user._id': 0,
        'nonvip.nonvip.user.isVip': 0,
        'nonvip.nonvip.user.isAdmin': 0,
        'nonvip.nonvip.user.createdDate': 0,
        'nonvip.nonvip.user.__v': 0,
      });

    return groupComp1;
  }
}

/*
 //get by filter status for admin in js
 async getAllCF(filterS: GetComStatusDto) {
  const { status } = filterS;
  let comp = await this.getAllC();
  if (status) {
    comp = comp.filter((comps) => comps.status === status);
    //if there is a filter using so filter the complaints depends on status passing by query if no return all complaints
  }
  return comp;
}*/

//get all complaints with descending sort(by createdDate) for admin without grouping
/* async getAllC() {
  return await this.complaintModel
    .find({}, { _id: 0, __v: 0 })
    .sort({ createdDate: 'desc' });
}
*/

// vip query alone
/* const vipgroup = await this.complaintModel
      .aggregate()
      .lookup({
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      })
      .project({ __v: 0 })
      .match({ 'user.isVip': true })
      .group({
        _id: '$user.isVip',
        vip: { $push: '$$ROOT' },
      })
      .project({ _id: 0 })
      .sort({ createdDate: 'desc' });

      //noVip query alone
    const nonvipgroup = await this.complaintModel
      .aggregate()
      .lookup({
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      })
      .project({ __v: 0 })
      .match({ 'user.isVip': false })
      .group({
        _id: '$user.isVip',
        nonvip: { $push: '$$ROOT' },
      })
      .project({ _id: 0 })
      .sort({ createdDate: 'desc' });

*/
