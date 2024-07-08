import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrgUserModule } from './org-user/org-user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [OrgUserModule, ConfigModule.forRoot(), MongooseModule.forRoot(process.env.MDB_URL), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
