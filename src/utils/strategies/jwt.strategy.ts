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

    async validate(payload) {
        const user = await this.userModel
            .findOne({
                _id: payload._id,
            })
            .lean();
        // .populate('role');
        if (user) {
            if (user.isDisable) {
                throw new BadRequestException(generateMessage('User').IS_DISABLED);
            }
            return { ...user, role: OrgUser.name };
        }
        throw new UnauthorizedException();
    }
}
