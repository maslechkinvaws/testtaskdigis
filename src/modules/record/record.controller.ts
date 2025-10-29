import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RecordService } from './record.service';
import { GetRecordsQueryDto } from './dtos/get-records-query.dto';
import { GetRecordsResponseDto } from './dtos/get-records-response.dto';
import { AggregateRecordsQueryDto } from './dtos/aggregate-records-query.dto';
import { AggregateRecordsResponseDto } from './dtos/aggregate-records-response.dto';

@ApiTags('Records')
@Controller('record')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Get()
  @ApiOperation({ summary: 'Get all records' })
  @ApiResponse({
    status: 200,
    description: 'List of records',
    type: GetRecordsResponseDto,
  })
  async findAll(@Query() query: GetRecordsQueryDto) {
    const { limit, offset } = query;
    const [records, total] = await this.recordService.findAll(query);
    return { data: records, meta: { total, limit, offset } };
  }

  @Get('aggregate')
  @ApiOperation({ summary: 'Aggregate records' })
  @ApiResponse({
    status: 200,
    description: 'Aggregate records',
    type: AggregateRecordsResponseDto,
  })
  async aggregate(@Query() query: AggregateRecordsQueryDto) {
    const result = await this.recordService.aggregate(query);
    return result;
  }
}
