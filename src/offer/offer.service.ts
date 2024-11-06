import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Offer,
  CreateOfferDto,
  generateMessage,
  Response,
  UpdateOfferDto,
  User,
  DeleteOfferDto,
} from 'src/utils';

@Injectable()
export class OfferService {
  constructor(
    @InjectModel(Offer.name) private readonly offerModel: Model<Offer>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  private MESSAGES = generateMessage('Offer');
  private StatusCode: number = 200;
  async create(createOfferDto: CreateOfferDto) {
    try {
      let user = await this.userModel.findById(createOfferDto.userId);
      if (!user) {
        this.StatusCode = 404;
        throw new Error(this.MESSAGES.NOTFOUND);
      }
      const newOffer = new this.offerModel(createOfferDto);
      let offer = await newOffer.save();
      return new Response((this.StatusCode = 200), this.MESSAGES.CREATED, {
        offer,
      });
    } catch (error) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, error?.message, error).error();
    }
  }

  async findAll() {
    try {
      let categories = await this.offerModel.find({});
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
      let offer = await this.offerModel.findById(id);
      if (!offer) {
        this.StatusCode = 404;
        throw new Error(this.MESSAGES.NOTFOUND);
      }
      return new Response((this.StatusCode = 200), this.MESSAGES.RETRIEVE, {
        offer,
      });
    } catch (error) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, error?.message, error).error();
    }
  }

  async update(updateOfferDto: UpdateOfferDto) {
    try {
      let user = await this.userModel.findOne({
        _id: updateOfferDto.userId,
      });
      if (!user) {
        this.StatusCode = 404;
        throw new Error(this.MESSAGES.NOTFOUND);
      }
      let offer = await this.offerModel.findByIdAndUpdate(
        updateOfferDto._id,
        {
          $set: updateOfferDto,
        },
        { new: true },
      );

      if (!offer) {
        this.StatusCode = 404;
        throw new Error(this.MESSAGES.NOTFOUND);
      }
      return new Response((this.StatusCode = 200), this.MESSAGES.UPDATED, {
        offer,
      });
    } catch (error) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, error?.message, error).error();
    }
  }

  async remove(deleteOfferDto: DeleteOfferDto) {
    try {
      let user = await this.userModel.findOne({
        _id: deleteOfferDto.userId,
      });
      if (!user) {
        this.StatusCode = 404;
        throw new Error(this.MESSAGES.NOTFOUND);
      }
      let offer = await this.offerModel.findByIdAndDelete(
        deleteOfferDto._id,
      );
      if (!offer) {
        this.StatusCode = 404;
        throw new Error(this.MESSAGES.NOTFOUND);
      }
      return new Response((this.StatusCode = 200), this.MESSAGES.DELETED, {
        offer,
      });
    } catch (error) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, error?.message, error).error();
    }
  }
}
