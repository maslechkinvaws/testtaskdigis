import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AggregateRecordsQueryDto {
  @ApiPropertyOptional({ example: 10, description: 'Aggregate from' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  from: number;

  @ApiPropertyOptional({ example: 100, description: 'Aggregate to' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  to: number;
}
