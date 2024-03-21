import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './schema/user.schema';
import { CreateUserDto } from './dto/ceate-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: mongoose.Model<User>,
    private jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const { password, passwordConfirm } = createUserDto;

    if (password.trim() !== passwordConfirm.trim()) {
      throw new BadRequestException(
        'Password and confirm password do not match',
      );
    }
    const user = this.UserModel.create(createUserDto);

    return user;
  }

  async login(loginUserDto: LoginUserDto, res: Response): Promise<void> {
    const user = await this.UserModel.findOne({
      email: loginUserDto.email,
    }).select('+password');

    if (
      !user ||
      !(await await bcrypt.compare(loginUserDto.password, user.password))
    ) {
      throw new UnauthorizedException('Please enter valid email or password ');
    }

    const payload = { email: user.email, role: user.role, userId: user._id };
    console.log(payload);

    const token = await this.jwtService.signAsync(payload);

    console.log(token);

    res.set('Authorization', `Bearer ${token}`);

    res.json({
      token,
    });
  }
}
