import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { response } from 'express';
import { Model, Types } from 'mongoose';
import * as nodemailer from 'nodemailer';
import {
  AddOrRemoveSocialMediaDto,
  comparePassword,
  generateMessage,
  generateTokenUser,
  hashPassword,
  LoginUserDto,
  Response,
  SignUpUserDto,
  UpdateUserDto,
  User,
  VerifyOtpDto,
  ForgetPasswordDto,
  Review,
  AddReviewDto,
  VerifyOtpForgetPasswordDto,
  Offer,
  Gallery,
} from 'src/utils';

@Injectable()
export class UserService {
  private transporter;
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    @InjectModel(Offer.name) private readonly offerModel: Model<Offer>,
    @InjectModel(Gallery.name) private readonly galleryModel: Model<Gallery>,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com', // e.g., smtp.gmail.com
      port: 465, // use 465 for secure SMTP
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'mohammad.mavia1999@gmail.com', // your email
        pass: process.env.GMAIL_PASSWORD, // your email password
      },
    });
  }
  private MESSAGES = generateMessage('User');
  private StatusCode: number = 200;

  async signup(createUserDto: SignUpUserDto) {
    try {
      const exists = await this.userModel.findOne({
        email: createUserDto.email,
      });
      console.log(exists, 'exists');
      if (exists) {
        this.StatusCode = 400;
        throw new Error(this.MESSAGES.EXIST);
      }

      // hash password
      createUserDto.password = await hashPassword(createUserDto.password);
      const createdUser = await this.userModel.create({
        ...createUserDto,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      delete createdUser.password;

      //generate token
      const token = generateTokenUser(createdUser);
      return new Response((this.StatusCode = 201), this.MESSAGES.CREATED, {
        user: createdUser,
        token,
      });
    } catch (err: any) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, err?.message, err);
    }
  }
  async login(loginUserDto: LoginUserDto) {
    try {
      const exists = await this.userModel
        .findOne({
          email: loginUserDto.email,
        })
        .populate('category')
        .populate('contacts', '-password -otpCode')
        .lean();
      if (!exists) {
        this.StatusCode = 404;
        throw new Error(this.MESSAGES.NOTFOUND);
      }
      console.log(
        comparePassword(loginUserDto.password, exists.password),
        'is same password',
      );
      // password check
      if (!(await comparePassword(loginUserDto.password, exists.password))) {
        this.StatusCode = 400;
        throw new Error(this.MESSAGES.INVALID_PASSWORD);
      }

      //generate token
      delete exists.password;
      delete exists.otpCode;
      let gallery = await this.galleryModel
        .find({ userId: exists._id.toString() })
        .lean();
      let offer = await this.offerModel
        .find({ userId: exists._id.toString() })
        .lean();
      const token = generateTokenUser(exists);
      return new Response((this.StatusCode = 200), this.MESSAGES.LOGIN, {
        user: { ...exists, gallery, offer },
        token,
      });
    } catch (err: any) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, err?.message, err).error();
    }
  }
  async getUsers() {
    try {
      let user = await this.userModel
        .find({})
        .select('-password -otpCode')
        .populate('category')
        .populate('contacts', '-password -otpCode');

      return new Response((this.StatusCode = 200), this.MESSAGES.RETRIEVEALL, {
        user,
      });
    } catch (err) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, err?.message, err).error();
    }
  }
  async findOne(id: string) {
    try {
      const user = await this.userModel
        .findById(new Types.ObjectId(id))
        .populate('category')
        .populate('contacts', '-password -otpCode')
        .select('-password -otpCode')
        .lean();
      let reviewCount = await this.reviewModel.countDocuments({
        reviewTo: id,
      });
      let gallery = await this.galleryModel.find({ userId: id.toString() }).lean();
      let offer = await this.offerModel.find({ userId: id.toString() }).lean();

      if (!user) {
        this.StatusCode = 404;
        throw new Error(this.MESSAGES.NOTFOUND);
      }
      return new Response((this.StatusCode = 201), this.MESSAGES.RETRIEVE, {
        ...user,
        reviewCount,
        gallery,
        offer,
      });
    } catch (err: any) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, err?.message, err).error();
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userModel
        .findByIdAndUpdate(
          id,
          { $set: { ...updateUserDto, updatedAt: Date.now() } },
          { new: true },
        )
        .populate('category')
        .populate('contacts', '-password -otpCode')
        .select('-password -otpCode');
      if (!user) {
        this.StatusCode = 404;
        throw new Error(this.MESSAGES.NOTFOUND);
      }

      return new Response(this.StatusCode, this.MESSAGES.UPDATED, user);
    } catch (err: any) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, err?.message, err).error();
    }
  }
  async addContact(id: string, contactId: string) {
    try {
      let user = await this.userModel.findById(contactId);
      if (!user) {
        this.StatusCode = 404;
        throw new Error(this.MESSAGES.NOTFOUND);
      }

      const updated = await this.userModel.findByIdAndUpdate(
        id,
        {
          $addToSet: { contacts: contactId },
        },
        {
          new: true,
        },
      );
      return new Response(this.StatusCode, this.MESSAGES.UPDATED, updated);
    } catch (err: any) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, err?.message, err).error();
    }
  }
  async removeContact(id: string, contactId: string) {
    try {
      let user = await this.userModel.findById(contactId);
      if (!user) {
        this.StatusCode = 404;
        throw new Error(this.MESSAGES.NOTFOUND);
      }
      const updated = await this.userModel.findByIdAndUpdate(
        id,
        {
          $pull: { contacts: contactId },
        },
        {
          new: true,
        },
      );
      return new Response(this.StatusCode, this.MESSAGES.UPDATED, updated);
    } catch (err: any) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, err?.message, err).error();
    }
  }
  async addSocialMedia(id: string, socialMedia: AddOrRemoveSocialMediaDto) {
    try {
      const updated = await this.userModel.findByIdAndUpdate(
        id,
        {
          $addToSet: { socialMedia },
        },
        {
          new: true,
        },
      );
      return new Response(this.StatusCode, this.MESSAGES.UPDATED, updated);
    } catch (err: any) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, err?.message, err).error();
    }
  }
  async removeSocialMedia(id: string, socialId: string) {
    try {
      const updated = await this.userModel
        .findByIdAndUpdate(
          id,
          {
            $pull: { socialMedia: { _id: socialId } },
          },
          {
            new: true,
          },
        )
        .exec();
      return new Response(this.StatusCode, this.MESSAGES.UPDATED, updated);
    } catch (err: any) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, err?.message, err).error();
    }
  }
  async sendOtp(email: string) {
    try {
      const user = await this.userModel.findOneAndUpdate(
        { email },
        {
          $set: {
            otpCode: Math.floor(100000 + Math.random() * 900000),
          },
        },
        { new: true },
      );
      const mailOptions = {
        from: 'mohammad.mavia1999@gmail.com', // sender address
        to: email, // list of receivers
        subject: 'Verification Code', // Subject line
        text: `Your verification code is ${user.otpCode}`, // plain text body
      };
      const info = await this.transporter.sendMail(mailOptions);
      return new Response(this.StatusCode, this.MESSAGES.RETRIEVE, {
        message: 'Verification code sent successfully!',
      });
    } catch (err: any) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, err?.message, err).error();
    }
  }
  async sendOtpForgetPassword(email: string) {
    try {
      const user = await this.userModel.findOneAndUpdate(
        { email },
        {
          $set: {
            forgetPasswordOtp: Math.floor(100000 + Math.random() * 900000),
            forgetPassword: true,
          },
        },
        { new: true },
      );
      if(!user){
        this.StatusCode = 404;
        throw new Error(this.MESSAGES.NOTFOUND);
      }
      const mailOptions = {
        from: 'mohammad.mavia1999@gmail.com', // sender address
        to: email, // list of receivers
        subject: 'Verification Code', // Subject line
        text: `Your verification code is ${user.forgetPasswordOtp}`, // plain text body
      };
      const info = await this.transporter.sendMail(mailOptions);
      return new Response(this.StatusCode, this.MESSAGES.RETRIEVE, {
        message: 'Verification code sent successfully!',
      });
    } catch (err: any) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, err?.message, err).error();
    }
  }
  async verifyOtp(email: string, body: VerifyOtpDto) {
    try {
      let user;
      user = await this.userModel
        .findOneAndUpdate(
          { email, otpCode: body.otp },
          {
            $set: { verified: true, otpCode: null },
          },
          { new: true },
        )
        .select('-password -otpCode');
      if (!user) {
        this.StatusCode = 400;
        throw new Error(this.MESSAGES.INVALID_OTP);
      }
      return new Response(this.StatusCode, this.MESSAGES.VALID_OTP, {
        message: 'OTP Verified',
      });
    } catch (err: any) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, err?.message, err).error();
    }
  }
  async verifyOtpForgetPassword(
    body: VerifyOtpForgetPasswordDto,
  ): Promise<Response> {
    try {
      let user;

      user = await this.userModel
        .findOne({ email: body.email, forgetPasswordOtp: body.otp })
        .select('-password -otpCode');
      if (!user) {
        return new Response(this.StatusCode, this.MESSAGES.INVALID_OTP, {
          message: 'OTP Unverified',
          verified: false,
        });
      }
      return new Response(this.StatusCode, this.MESSAGES.VALID_OTP, {
        message: 'OTP Verified',
        verified: true,
      });
    } catch (err: any) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, err?.message, err);
    }
  }
  async forgetPassword(body: ForgetPasswordDto) {
    try {
      let isVerify = await this.verifyOtpForgetPassword({
        email: body.email,
        otp: body.otp,
      });
      if (!isVerify.payload.verified) {
        this.StatusCode = 400;
        throw new Error(this.MESSAGES.INVALID_OTP);
      }
      let user = await this.userModel.findOneAndUpdate(
        { email: body.email },
        {
          $set: {
            password: await hashPassword(body.password),
            forgetPasswordOtp: null,
            forgetPassword: false,
          },
        },
        { new: true },
      );
      if (!user) {
        this.StatusCode = 400;
        throw new Error(this.MESSAGES.INVALID_OTP);
      }
      return new Response(this.StatusCode, this.MESSAGES.UPDATED, {
        message: 'Password updated successfully!',
      });
    } catch (err: any) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, err?.message, err).error();
    }
  }
  async createReview(review: AddReviewDto) {
    try {
      const newReview = new this.reviewModel({
        ...review,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      const createdReview = await newReview.save();
      let averageRating = await this.reviewModel.aggregate([
        {
          $match: {
            reviewTo: new Types.ObjectId(review.reviewTo),
          },
        },
        {
          $group: {
            _id: '$reviewTo',
            averageRating: { $avg: '$rating' },
          },
        },
      ]);
      console.log(averageRating);
      await this.userModel.findByIdAndUpdate(review.reviewTo, {
        $set: { rating: averageRating[0].averageRating },
      });

      return new Response(
        (this.StatusCode = 201),
        this.MESSAGES.CREATED,
        createdReview,
      );
    } catch (err: any) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, err?.message, err).error();
    }
  }
  async getReviews(reviewTo: string) {
    try {
      let reviews = await this.reviewModel
        .find({ reviewTo })
        .populate('reviewFrom', '-password -otpCode -forgetPasswordOtp')
        .populate('reviewTo', '-password -otpCode -forgetPasswordOtp');
      return new Response((this.StatusCode = 200), this.MESSAGES.RETRIEVEALL, {
        reviews,
      });
    } catch (err) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, err?.message, err).error();
    }
  }
  async getFilterUsers(filter) {
    try {
      let { category, rating, city, _type } = filter;
      let users = await this.userModel
        .find({
          ...(_type && { _type }),
          ...(category && { category }), // Include 'category' only if it's provided
          ...(city && { city }),
        })
        .sort({ rating })
        .select('-password -otpCode')
        .populate('category')
        .populate('contacts', '-password -otpCode')
        .lean();
      return new Response((this.StatusCode = 200), this.MESSAGES.RETRIEVEALL, {
        users,
      });
    } catch (err) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, err?.message, err).error();
    }
  }
}
