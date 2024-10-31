import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './createCategory';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
