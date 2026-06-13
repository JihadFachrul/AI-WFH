import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { CalendarEventType } from '@prisma/client';
import { PaginationQueryDto } from '../../../common/dto/pagination.dto';

/** Query GET /api/calendar/events: pagination + search (title) + filter type. */
export class QueryCalendarDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(CalendarEventType, { message: 'type tidak valid' })
  type?: CalendarEventType;
}

/** Query GET /api/calendar/month: month=1-12 & year. Default = bulan & tahun ini. */
export class QueryMonthDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1970)
  @Max(3000)
  year?: number;
}

/** Query GET /api/calendar/upcoming: limit jumlah item (default 5). */
export class QueryUpcomingDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
