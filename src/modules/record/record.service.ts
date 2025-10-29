import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Record } from './entities/record.entity';
import { Repository } from 'typeorm';
import { GetRecordsQueryDto } from './dtos/get-records-query.dto';
import { AggregateRecordsQueryDto } from './dtos/aggregate-records-query.dto';
import { AggregateRecordsResponseDto } from './dtos/aggregate-records-response.dto';
import { AggregateResult } from './types/aggregate-result.type';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
  ) {}

  async findAll(query: GetRecordsQueryDto): Promise<[Record[], number]> {
    return this.recordRepository.findAndCount({
      take: query.limit,
      skip: query.offset,
      order: query.sort ? { [query.sort]: query.order ?? 'ASC' } : {},
    });
  }

  async aggregate(
    query: AggregateRecordsQueryDto,
  ): Promise<AggregateRecordsResponseDto> {
    const { from, to } = query;

    const result = await this.recordRepository
      .createQueryBuilder('r')
      .select([
        `SUM(CASE WHEN r.value < :from THEN 1 ELSE 0 END) AS before`,
        `SUM(CASE WHEN r.value BETWEEN :from AND :to THEN 1 ELSE 0 END) AS inside`,
        `SUM(CASE WHEN r.value > :to THEN 1 ELSE 0 END) AS after`,
      ])
      .setParameters({ from, to })
      .getRawOne<AggregateResult>();

    return {
      data: {
        before: Number(result?.before ?? 0),
        inside: Number(result?.inside ?? 0),
        after: Number(result?.after ?? 0),
      },
    };
  }
}
