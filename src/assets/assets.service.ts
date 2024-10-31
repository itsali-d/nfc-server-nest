import { Injectable } from '@nestjs/common';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { generateMessage } from 'src/utils/message.utility';
import { Response } from 'src/utils/response.utility';
import * as fs from 'fs';

@Injectable()
export class AssetsService {
  constructor(private configService: ConfigService) {
    this.aws = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  private aws: AWS.S3;
  private MESSAGES = generateMessage('Assets');
  private StatusCode = 200;
  async create(files: any) {
    try {
      if (files.length == 0) {
        return new Response(
          (this.StatusCode = 400),
          this.MESSAGES.BADREQUEST,
          {},
        ).error();
      }

      const uploadPromis = files.map(async (file: any) => {
        const params = {
          Bucket: process.env.BUCKET_NAME,
          Key: `admin/${file.originalname.replace(/\s+/g, '_')}`,
          Body: fs.createReadStream(file.path),
        };
        const result = await this.aws.upload(params).promise();
        return {
          location: result.Location,
        };
      });
      const reponse = await Promise.all(uploadPromis);

      files.forEach((file: any) => {
        try {
          fs.unlinkSync(file.path);
        } catch (err: any) {
          this.StatusCode = 400;
          return new Response(
            err.http_code || this.StatusCode,
            err.http_code ? 'File size is too large' : err?.message,
            err,
          ).error();
        }
      });
      return new Response(
        (this.StatusCode = 200),
        this.MESSAGES.CREATED,
        reponse,
      );
    } catch (err: any) {
      this.StatusCode =
        this.StatusCode == 200 ? err.http_code || 500 : this.StatusCode;
      return new Response(this.StatusCode, err?.message, err).error();
    }
  }


  findAll() {
    return `This action returns all assets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} asset`;
  }

  update(id: number, updateAssetDto: UpdateAssetDto) {
    return `This action updates a #${id} asset`;
  }

  remove(id: number) {
    return `This action removes a #${id} asset`;
  }
}
