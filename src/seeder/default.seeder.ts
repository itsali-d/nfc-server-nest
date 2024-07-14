import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { hashPassword, OrgUser } from 'src/utils';
import { Model } from 'mongoose';

@Injectable()
export class DefaultSeed {
  constructor(
    @InjectModel(OrgUser.name) private organizationUserModel: Model<OrgUser>,
  ) {}

  async createAdmin() {
    const adminExist = await this.organizationUserModel.findOne({});

    if (!adminExist) {
      const pwd = await hashPassword('admin');
      return await this.organizationUserModel.create({
        name: 'admin',
        email: 'admin@domain.co',
        password: pwd,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return console.log('admin already exist');
  }
}
