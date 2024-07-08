
import { IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
 
export class PaginationParams {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  pageIndex?: number;
 
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize?: number;
}