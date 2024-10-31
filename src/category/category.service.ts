import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Category,
  CreateCategoryDto,
  generateMessage,
  Response,
  UpdateCategoryDto,
} from 'src/utils';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}
  private MESSAGES = generateMessage('Category');
  private StatusCode: number = 200;
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const newCategory = new this.categoryModel(createCategoryDto);
      let category = await newCategory.save();
      return new Response((this.StatusCode = 200), this.MESSAGES.CREATED, {
        category,
      });
    } catch (error) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, error?.message, error).error();
    }
  }

  async findAll() {
    try {
      let categories = await this.categoryModel.find({});
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
      let category = await this.categoryModel.findById(id);
      if (!category) {
        this.StatusCode = 404;
        throw new Error(this.MESSAGES.NOTFOUND);
      }
      return new Response((this.StatusCode = 200), this.MESSAGES.RETRIEVE, {
        category,
      });
    } catch (error) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, error?.message, error).error();
    }
  }

  async update(id, updateCategoryDto: UpdateCategoryDto) {
    try {
      let category = await this.categoryModel.findByIdAndUpdate(
        id,
        {
          $set: updateCategoryDto,
        },
        { new: true },
      );

      if (!category) {
        this.StatusCode = 404;
        throw new Error(this.MESSAGES.NOTFOUND);
      }
      return new Response((this.StatusCode = 200), this.MESSAGES.UPDATED, {
        category,
      });
    } catch (error) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, error?.message, error).error();
    }
  }

  async remove(id) {
    try {
      let category = await this.categoryModel.findByIdAndDelete(id);
      if (!category) {
        this.StatusCode = 404;
        throw new Error(this.MESSAGES.NOTFOUND);
      }
      return new Response((this.StatusCode = 200), this.MESSAGES.DELETED, {
        category,
      });
    } catch (error) {
      this.StatusCode = this.StatusCode == 200 ? 500 : this.StatusCode;
      return new Response(this.StatusCode, error?.message, error).error();
    }
  }
}
