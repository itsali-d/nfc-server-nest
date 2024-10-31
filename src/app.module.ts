import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrgUserModule } from './org-user/org-user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DefaultSeed } from 'src/seeder/default.seeder';
import { OrgUser, OrgUserSchema } from 'src/utils';
import { AssetsModule } from './assets/assets.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    OrgUserModule,
    MongooseModule.forRoot(process.env.MDB_URL),
    MongooseModule.forFeature([{ name: OrgUser.name, schema: OrgUserSchema }]),
    UserModule,
    AssetsModule,

  ],
  controllers: [AppController],
  providers: [AppService, DefaultSeed],
})
export class AppModule {
  constructor(private readonly seederService: DefaultSeed) {
    this.seedData();
  }
  async seedData() {
    await this.seederService.createAdmin();
  }
}
