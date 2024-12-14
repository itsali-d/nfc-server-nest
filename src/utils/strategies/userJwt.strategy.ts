import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schema';

interface JwtPayload {
  _id: string;
}

interface ValidatedUser {
  _id: string;
  role: string;
  name?: string;
  email?: string;
  dateOfBirth?: string;
  otpCode?: number;
  forgetPasswordOtp?: number;
  [key: string]: any; // Allow additional dynamic properties
}

@Injectable()
export class JwtStrategyUser extends PassportStrategy(Strategy, 'user') {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.TOKEN_SECRET_USER,
    });

    // Ensure TOKEN_SECRET_USER is defined
    if (!process.env.TOKEN_SECRET_USER) {
      throw new Error(
        'TOKEN_SECRET_USER is not set in the environment variables',
      );
    }
  }

  async validate(payload: JwtPayload): Promise<ValidatedUser> {
    console.log('Payload:', payload);

    const user = await this.userModel
      .findOne({ _id: payload._id })
      .lean<User>(); // Explicitly specify the return type for lean()

    if (user) {
      // Ensure _id is cast to a string if necessary
      return { ...user, _id: String(user._id), role: User.name };
    }

    throw new UnauthorizedException('User not found or unauthorized');
  }
}
