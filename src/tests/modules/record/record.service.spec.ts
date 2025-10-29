import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Record } from '../../../modules/record/entities/record.entity';
import { AggregateRecordsQueryDto } from '../../../modules/record/dtos/aggregate-records-query.dto';
import { AggregateRecordsResponseDto } from '../../../modules/record/dtos/aggregate-records-response.dto';
import { RecordService } from '../../../modules/record/record.service';

describe('RecordService', () => {
  let service: RecordService;
  let repository: Partial<Repository<Record>>;

  beforeEach(async () => {
    const mockRepository = {
      createQueryBuilder: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        getRawOne: jest.fn(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecordService,
        { provide: getRepositoryToken(Record), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<RecordService>(RecordService);
    repository = module.get(getRepositoryToken(Record));
  });

  it('should aggregate records correctly', async () => {
    const mockResult = { before: '2', inside: '3', after: '1' };
    (repository.createQueryBuilder as jest.Mock).mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      setParameters: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue(mockResult),
    });

    const query: AggregateRecordsQueryDto = { from: 10, to: 100 };
    const result: AggregateRecordsResponseDto = await service.aggregate(query);

    expect(result.data.before).toBe(2);
    expect(result.data.inside).toBe(3);
    expect(result.data.after).toBe(1);
    expect(repository.createQueryBuilder).toHaveBeenCalledWith('r');
  });
});
