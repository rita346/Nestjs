import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from 'src/guards/local.guard';
import { Serialize } from 'src/interceptor/serialize.interceptor';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //SignUp
  @Post('/signup')
  @Serialize(UserDto)
  async signup(@Body() body: SignupDto) {
    return await this.authService.signup(
      body.email,
      body.password,
      body.firstName,
      body.lastName,
      body.isVip,
      body.isAdmin,
    );
  }

  /*
  //Signup 2
  @Post('/sign')
  @Serialize(UserDto)
  async signupU(@Body() body: SignupDto) {
    return this.authService.signup2(body);
  }
*/

  //Signin with local strategy
  @UseGuards(LocalAuthGuard)
  @Post('/signinL')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }
}
