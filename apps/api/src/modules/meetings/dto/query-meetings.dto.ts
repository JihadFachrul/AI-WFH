import { IsISO8601, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination.dto';

/** Query GET /api/meetings: pagination + search (title) + date (1 hari). */
export class QueryMeetingsDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  /** Filter meeting yang mulai pada tanggal ini (YYYY-MM-DD, rentang 1 hari UTC). */
  @IsOptional()
  @IsISO8601({}, { message: 'date harus tanggal ISO-8601' })
  date?: string;
}
