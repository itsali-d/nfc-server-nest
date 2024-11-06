import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Gallery,
  CreateGalleryDto,
  generateMessage,
  Response,
  UpdateGalleryDto,
  User,
  DeleteGalleryDto,
} from 'src/utils';

@Injectable()
export class GalleryService {
  constructor(
    @InjectModel(Gallery.name) private readonly galleryModel: Model<Gallery>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  private MESSAGES = generateMessage('Gallery');
  private StatusCode: number = 200;
  async create(createGalleryDto: CreateGalleryDto) {
    try {
      let user = await this.userModel.findById(createGalleryDto.userId);
      if (!user) {
        this.StatusCode = 404;
        throw new Error(this.MESSAGES.NOTFOUND);
      }
      const newGallery = new this.galleryModel(createGalleryDto);
      let gallery = await newGallery.save();
      return new Response((this.StatusCode = 200), this.MESSAGES.CREATED, {
        gallery,
      });
    } catch (error) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, error?.message, error).error();
    }
  }

  async findAll() {
    try {
      let categories = await this.galleryModel.find({});
      return new Response((this.StatusCode = 200), this.MESSAGES.RETRIEVEALL, {
        categories,
      });
    } catch (error) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, error?.message, error).error();
    }
  }

  async findOne(id) {
    try {
      let gallery = await this.galleryModel.findById(id);
      if (!gallery) {
        this.StatusCode = 404;
        throw new Error(this.MESSAGES.NOTFOUND);
      }
      return new Response((this.StatusCode = 200), this.MESSAGES.RETRIEVE, {
        gallery,
      });
    } catch (error) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, error?.message, error).error();
    }
  }

  async update(updateGalleryDto: UpdateGalleryDto) {
    try {
      let user = await this.userModel.findOne({
        _id: updateGalleryDto.userId,
      });
      if (!user) {
        this.StatusCode = 404;
        throw new Error(this.MESSAGES.NOTFOUND);
      }
      let gallery = await this.galleryModel.findByIdAndUpdate(
        updateGalleryDto._id,
        {
          $set: updateGalleryDto,
        },
        { new: true },
      );

      if (!gallery) {
        this.StatusCode = 404;
        throw new Error(this.MESSAGES.NOTFOUND);
      }
      return new Response((this.StatusCode = 200), this.MESSAGES.UPDATED, {
        gallery,
      });
    } catch (error) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, error?.message, error).error();
    }
  }

  async remove(deleteGalleryDto: DeleteGalleryDto) {
    try {
      let user = await this.userModel.findOne({
        _id: deleteGalleryDto.userId,
      });
      if (!user) {
        this.StatusCode = 404;
        throw new Error(this.MESSAGES.NOTFOUND);
      }
      let gallery = await this.galleryModel.findByIdAndDelete(
        deleteGalleryDto._id,
      );
      if (!gallery) {
        this.StatusCode = 404;
        throw new Error(this.MESSAGES.NOTFOUND);
      }
      return new Response((this.StatusCode = 200), this.MESSAGES.DELETED, {
        gallery,
      });
    } catch (error) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, error?.message, error).error();
    }
  }
}
