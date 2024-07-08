import { Module } from '@nestjs/common';
import { OrgUserController } from './org-user.controller';
import { OrgUserService } from './org-user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategyOrgUser, OrgUser, OrgUserSchema } from 'src/utils';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: OrgUser.name,
        schema: OrgUserSchema,
      },
    ]),
  ],
  controllers: [OrgUserController],
  providers: [OrgUserService, JwtStrategyOrgUser],
})
export class OrgUserModule {}
