import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schema';

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
  }

  async validate(payload) {
    console.log(payload);
    const user = await this.userModel
      .findOne({
        _id: payload._id,
      })
      .lean();
    // .populate('role');
    if (user) {
      // if (user.isDisable) {
      //   throw new BadRequestException(generateMessage('User').IS_DISABLED);
      // }
      return { ...user, role: User.name };
    }
    throw new UnauthorizedException();
  }
}
