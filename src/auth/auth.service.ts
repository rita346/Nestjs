import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.model';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('user') private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  //Signup
  async signup(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    isVip: boolean,
    isAdmin: boolean,
  ) {
    const checkUser = await this.userModel.findOne({ email });
    if (checkUser) {
      throw new BadRequestException('Email is taken');
    }
    password = await bcrypt.hash(password, 10);
    const user = this.userModel.create({
      email,
      password,
      firstName,
      lastName,
      isVip,
      isAdmin,
    });
    return user;
  }

  //signup 2
  async signup2(users: SignupDto) {
    const checkUser = await this.userModel.findOne({ email: users.email });
    if (checkUser) {
      throw new BadRequestException('Email is taken');
    }
    const user = this.userModel.create(users);
    return user;
  }

  //signin if u dont want to use local strategy
  async signin(email: string, password: string) {
    const checkemail = await this.userModel.findOne({ email });
    if (!checkemail) {
      throw new NotFoundException('email not found');
    }
    const checkpass = await bcrypt.compare(password, checkemail.password);
    if (!checkpass) {
      throw new BadRequestException('Bad password');
    }

    const payload = { id: checkemail.id, email: checkemail.email };
    return { access_token: this.jwtService.sign(payload) };
  }

  //signin for local strategy
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    const passwordValid = await bcrypt.compare(pass, user.password);
    if (!passwordValid) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, id: user.id, isAdmin: user.isAdmin };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
