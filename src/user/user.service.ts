import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
  ForgetPasswordDto
} from 'src/utils';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
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
      delete createUserDto.password;

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
      const exists = await this.userModel.findOne({
        email: loginUserDto.email,
      });
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
      let user = await this.userModel.find({}).select('-password -otpCode');

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
        .select('-password -otpCode');
      if (!user) {
        this.StatusCode = 404;
        throw new Error(this.MESSAGES.NOTFOUND);
      }
      return new Response(
        (this.StatusCode = 201),
        this.MESSAGES.RETRIEVE,
        user,
      );
    } catch (err: any) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, err?.message, err).error();
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userModel.findById(id);
      if (user) {
        this.StatusCode = 404;
        throw new Error(this.MESSAGES.NOTFOUND);
      }
      Object.keys(user).forEach((key) => {
        user[key] = updateUserDto[key];
      });
      const updated = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .select('-password -otpCode');
      return new Response(this.StatusCode, this.MESSAGES.UPDATED, updated);
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
      return new Response(this.StatusCode, this.MESSAGES.UPDATED, {
        otp: user.otpCode,
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
        user = await this.userModel.findOneAndUpdate(
          { email, otpCode: body.otp },
          {
            $set: { verified: true, otpCode: null },
          },
          { new: true },
        );
      else
        user = await this.userModel.findOneAndUpdate(
          { email, otpCode: body.otp },
          {
            $set: { forgetPassword: true, otpCode: null },
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
}
