import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
} from 'src/utils';

@Injectable()
export class UserService {
  private transporter;
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
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
      return new Response(this.StatusCode, err?.message, err).error();
    }
  }
  async login(loginUserDto: LoginUserDto) {
    try {
      const exists = await this.userModel
        .findOne({
          email: loginUserDto.email,
        })
        .populate('category')
        .populate('contacts', '-password -otpCode');
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
      const token = generateTokenUser(exists);
      return new Response((this.StatusCode = 200), this.MESSAGES.LOGIN, {
        user: exists,
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
        .findById(id)
        .populate('category')
        .populate('contacts', '-password -otpCode')
        .select('-password -otpCode')
        .lean();
      let reviewCount = await this.reviewModel.countDocuments({
        reviewTo: id,
      });
      if (!user) {
        this.StatusCode = 404;
        throw new Error(this.MESSAGES.NOTFOUND);
      }
      return new Response((this.StatusCode = 201), this.MESSAGES.RETRIEVE, {
        ...user,
        reviewCount,
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
  async sendOtp(email: string, isVerification: boolean = true) {
    try {
      const user = await this.userModel.findOneAndUpdate(
        { email },
        {
          $set: {
            otpCode: Math.floor(100000 + Math.random() * 900000),
            forgetPassword: isVerification ? false : true,
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
      return new Response(this.StatusCode, this.MESSAGES.CREATED, {
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
      if (body.isVerification)
        user = await this.userModel
          .findOneAndUpdate(
            { email, otpCode: body.otp },
            {
              $set: { verified: true, otpCode: null },
            },
            { new: true },
          )
          .select('-password -otpCode');
      else
        user = await this.userModel
          .findOneAndUpdate(
            { email, otpCode: body.otp },
            {
              $set: { forgetPassword: true, otpCode: null },
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
  async forgetPassword(email: string, body: ForgetPasswordDto) {
    try {
      let user = await this.userModel.findOneAndUpdate(
        { email },
        {
          $set: { password: await hashPassword(body.password) },
        },
        { new: true },
      );
      if (!user) {
        this.StatusCode = 400;
        throw new Error(this.MESSAGES.INVALID_OTP);
      }
      return new Response(this.StatusCode, this.MESSAGES.UPDATED, user);
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
            reviewTo: review.reviewTo,
          },
        },
        {
          $group: {
            _id: '$reviewTo',
            averageRating: { $avg: '$rating' },
          },
        },
      ]);
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
        .populate('reviewFrom')
        .populate('reviewTo');
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
        .populate('contacts', '-password -otpCode');
      return new Response((this.StatusCode = 200), this.MESSAGES.RETRIEVEALL, {
        users,
      });
    } catch (err) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, err?.message, err).error();
    }
  }
}
