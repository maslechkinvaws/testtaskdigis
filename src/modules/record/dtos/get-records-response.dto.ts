import { Record } from '../entities/record.entity';

export class GetRecordsResponseDto {
  data: Record[];

  meta: GetRecordsMetaResponseDto;
}

class GetRecordsMetaResponseDto {
  total: number;
  limit: number | undefined;
  offset: number | undefined;
}
