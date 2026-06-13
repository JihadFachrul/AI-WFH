import {
  ArrayUnique,
  IsArray,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
} from 'class-validator';

/** Payload PATCH /api/meetings/:id (partial). participantIds (jika ada) → replace. */
export class UpdateMeetingDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Judul meeting tidak boleh kosong' })
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsISO8601({}, { message: 'startAt harus tanggal ISO-8601' })
  startAt?: string;

  @IsOptional()
  @IsISO8601({}, { message: 'endAt harus tanggal ISO-8601' })
  endAt?: string;

  @IsOptional()
  @IsUrl({ require_tld: false }, { message: 'meetingUrl harus URL valid' })
  @MaxLength(500)
  meetingUrl?: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true, message: 'participantIds harus UUID valid' })
  participantIds?: string[];
}
