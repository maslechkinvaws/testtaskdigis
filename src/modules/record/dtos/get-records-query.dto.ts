import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetRecordsQueryDto {
  @ApiPropertyOptional({ example: 10, description: 'Count elements on page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ example: 0, description: 'Prev' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;

  @ApiPropertyOptional({ example: 'name', description: 'Sort' })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional({ example: 'ASC', description: 'Order' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';
}
