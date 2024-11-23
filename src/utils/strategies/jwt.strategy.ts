import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { generateMessage } from 'src/utils/message.utility';
import { OrgUser } from '../schema';

interface JwtOrgUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  isDisable: boolean;
  isOnline: boolean;
  createdAt: number;
  updatedAt: number;
  verified: boolean;
  role: string;
}

@Injectable()
export class JwtStrategyOrgUser extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(OrgUser.name)
    private userModel: Model<OrgUser>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.TOKEN_SECRET,
    });
  }

  async validate(payload: { _id: string }): Promise<JwtOrgUser> {
    const user = await this.userModel
      .findOne({ _id: payload._id })
      .lean<OrgUser>();

    if (user) {
      if (user.isDisable) {
        throw new BadRequestException(generateMessage('User').IS_DISABLED);
      }
      return { ...user, _id: String(user._id), role: OrgUser.name };
    }

    throw new UnauthorizedException();
  }
}
