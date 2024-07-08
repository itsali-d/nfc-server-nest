import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  comparePassword,
  CreateOrgUserDto,
  generateMessage,
  generateTokenAdmin,
  hashPassword,
  OrgUser,
  PaginationParams,
  Response,
  Role,
  UpdateOrgUserDto,
} from 'src/utils';

@Injectable()
export class OrgUserService {
  constructor(
    @InjectModel(OrgUser.name)
    private organizationUserModel: Model<OrgUser>,
  ) {}
  private MESSAGES = generateMessage('Organization User');
  private StatusCode: number = 200;
  async login(loginUserDto) {
    try {
      const exists = await this.organizationUserModel.findOne({
        email: loginUserDto.email,
      });
      if (!exists) {
        this.StatusCode = 404;
        throw new Error(this.MESSAGES.NOTFOUND);
      }

      // password check
      if (!(await comparePassword(loginUserDto.password, exists.password))) {
        this.StatusCode = 400;
        throw new Error(this.MESSAGES.INVALID_PASSWORD);
      }

      //access check
      if (exists.isDisable) {
        this.StatusCode = 400;
        throw new Error(this.MESSAGES.IS_DISABLED);
      }
      //generate token
      const token = generateTokenAdmin(exists);
      return new Response((this.StatusCode = 200), this.MESSAGES.LOGIN, {
        user: exists,
        token,
      });
    } catch (error) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, error?.message, error).error();
    }
  }
  private async isPermitted(myRole: string, userRole: string) {
    let isValid = false;
    switch (myRole) {
      case 'admin':
        isValid = userRole == Role.ADMIN || userRole == Role.MANAGER;
        break;
      case 'manager':
        isValid = userRole == Role.MANAGER;
        break;
      default:
        isValid = false;
        break;
    }
    return isValid;
  }
  async create(createUserDto: CreateOrgUserDto, user: OrgUser) {
    try {
      const exists = await this.organizationUserModel.findOne({
        email: createUserDto.email,
      });
      if (exists) {
        this.StatusCode = 400;
        throw new Error(this.MESSAGES.EXIST);
      }
      const isValid = await this.isPermitted(user.role, createUserDto.role);
      if (!isValid) {
        this.StatusCode = 400;
        throw new Error(this.MESSAGES.INVALID_CREATOR);
      }

      // hash password
      createUserDto.password = await hashPassword(createUserDto.password);
      const createdUser = await this.organizationUserModel.create({
        ...createUserDto,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      delete createUserDto.password;
      return new Response(
        (this.StatusCode = 201),
        this.MESSAGES.CREATED,
        createdUser,
      );
    } catch (err: any) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, err?.message, err).error();
    }
  }
  async findAll(paginationQuery: PaginationParams) {
    try {
      let query = this.organizationUserModel.find({}).populate('role');
      query = paginationQuery.pageIndex
        ? query.skip(paginationQuery.pageIndex)
        : query.skip(0);
      query = paginationQuery.pageSize
        ? query.limit(paginationQuery.pageSize)
        : query;
      let users = await query;
      let totalUser = await this.organizationUserModel.countDocuments();
      return new Response((this.StatusCode = 200), this.MESSAGES.RETRIEVEALL, {
        users,
        total: totalUser,
        ...paginationQuery,
      });
    } catch (err: any) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, err?.message, err).error();
    }
  }
  async findOne(id: string) {
    try {
      const user = await this.organizationUserModel
        .findById(id)
        .populate('role');
      if (!user) {
        this.StatusCode = 404;
        throw new Error(this.MESSAGES.NOTFOUND);
      }
      return new Response(
        (this.StatusCode = 200),
        this.MESSAGES.RETRIEVE,
        user,
      );
    } catch (err: any) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, err?.message, err).error();
    }
  }
  async update(id: string, updateUserDto: UpdateOrgUserDto, user: OrgUser) {
    try {
      const userExist = await this.organizationUserModel
        .findById(id)
        .populate('role');
      if (!userExist) {
        this.StatusCode = 404;
        throw new Error(this.MESSAGES.NOTFOUND);
      }
      let updates = {};
      //if its admin can update all
      if (user.role === Role.ADMIN) {
        'newPassword' in updateUserDto &&
          (updates['password'] = await this.updatePassword(
            updateUserDto.oldPassword,
            updateUserDto.newPassword,
            userExist.password,
          ));
        delete updateUserDto.newPassword;
        delete updateUserDto.oldPassword;
        Object.keys(updateUserDto).forEach((key) => {
          updates[key] = updateUserDto[key];
        });
      }
      // if the manager or CR is updating, validate to whom they are updating
      else if (this.isAllowToUpdate(user.role, userExist.role)) {
        'newPassword' in updateUserDto &&
          (updates['password'] = await this.updatePassword(
            updateUserDto.oldPassword,
            updateUserDto.newPassword,
            userExist.password,
          ));
        //if its manager then its allowed to
        'name' in updateUserDto && (updates['name'] = updateUserDto['name']);
      } else {
        this.StatusCode = 403;
        throw new Error(this.MESSAGES.FORBIDDEN);
      }
      let updated = await this.organizationUserModel.findByIdAndUpdate(
        id,
        { $set: { ...updates, updatedAt: Date.now() } },
        { new: true },
      );
      return new Response(this.StatusCode, this.MESSAGES.UPDATED, updated);
    } catch (err: any) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, err?.message, err).error();
    }
  }
  private isAllowToUpdate(myRole, userRole) {
    let isValid = false;
    switch (myRole) {
      case Role.ADMIN:
        isValid = userRole == Role.ADMIN || userRole == Role.MANAGER;
        break;
      case Role.MANAGER:
        isValid = userRole == Role.MANAGER;
        break;
    }
    return isValid;
  }

  private async updatePassword(oldPassword, newPassword, hashedPassword) {
    let isMatched = await comparePassword(oldPassword, hashedPassword);
    console.log(isMatched);
    if (isMatched) {
      return await hashPassword(newPassword);
    } else {
      this.StatusCode = 400;
      throw new Error(this.MESSAGES.INVALID_PASSWORD);
    }
  }
  async remove(id: string, user: OrgUser) {
    try {
      const userToDelete = await this.organizationUserModel.findById(id);
      let roleId = userToDelete.role;
      const isValid = await this.isPermitted(user.role, roleId.toString());
      if (!isValid) {
        this.StatusCode = 403;
        throw new Error(this.MESSAGES.FORBIDDEN);
      }
      const deletedUser =
        await this.organizationUserModel.findByIdAndDelete(id);
      return new Response(
        (this.StatusCode = 201),
        this.MESSAGES.CREATED,
        deletedUser,
      );
    } catch (err: any) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, err?.message, err).error();
    }
  }

  //forget password
  async forgetPassword(email: string) {
    try {
      const userExist = await this.organizationUserModel.findOne({ email });
      if (!userExist) {
        this.StatusCode = 404;
        throw new Error(this.MESSAGES.NOTFOUND);
      }
      let newPassword = await hashPassword('123456');
      const updatedUser = await this.organizationUserModel.findByIdAndUpdate(
        userExist._id,
        { $set: { password: newPassword, updatedAt: Date.now() } },
      );
      //send email to the user
      return new Response(
        (this.StatusCode = 201),
        this.MESSAGES.CREATED,
        updatedUser,
      );
    } catch (err: any) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, err?.message, err).error();
    }
  }
}
