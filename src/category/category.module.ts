import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Mongoose } from 'mongoose';
import {
  Category,
  CategorySchema,
  JwtStrategyOrgUser,
  OrgUser,
  OrgUserSchema,
} from 'src/utils';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: OrgUser.name,
        schema: OrgUserSchema,
      },
      {
        name: Category.name,
        schema: CategorySchema,
      },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, JwtStrategyOrgUser],
})
export class CategoryModule {}
