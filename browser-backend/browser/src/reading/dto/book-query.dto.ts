import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { Min } from 'class-validator';

export class BookQueryDto {
  @IsOptional()
  @IsString()
  search?: string='';

  @IsOptional()
  @IsNumber()
    @Type(()=>Number)
    @Min(1)
  page?:number=1

  @IsOptional()
  @IsNumber()
    @Type(()=>Number)
    @Min(1)
  limit?: number=10;
}
