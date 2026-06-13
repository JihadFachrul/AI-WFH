import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CalendarEventType } from '@prisma/client';

/** Payload PATCH /api/calendar/events/:id (partial). */
export class UpdateCalendarEventDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Judul event tidak boleh kosong' })
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsEnum(CalendarEventType, { message: 'type tidak valid' })
  type?: CalendarEventType;

  @IsOptional()
  @IsISO8601({}, { message: 'startAt harus tanggal ISO-8601' })
  startAt?: string;

  @IsOptional()
  @IsISO8601({}, { message: 'endAt harus tanggal ISO-8601' })
  endAt?: string;
}
