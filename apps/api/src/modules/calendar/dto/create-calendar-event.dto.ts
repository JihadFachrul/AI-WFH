import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CalendarEventType } from '@prisma/client';

/** Payload POST /api/calendar/events. startAt/endAt ISO-8601. */
export class CreateCalendarEventDto {
  @IsString()
  @IsNotEmpty({ message: 'Judul event tidak boleh kosong' })
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsEnum(CalendarEventType, { message: 'type tidak valid' })
  type: CalendarEventType;

  @IsISO8601({}, { message: 'startAt harus tanggal ISO-8601' })
  startAt: string;

  @IsISO8601({}, { message: 'endAt harus tanggal ISO-8601' })
  endAt: string;
}
