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

/** Payload POST /api/meetings. startAt/endAt ISO-8601. participantIds = user UUIDs. */
export class CreateMeetingDto {
  @IsString()
  @IsNotEmpty({ message: 'Judul meeting tidak boleh kosong' })
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsISO8601({}, { message: 'startAt harus tanggal ISO-8601' })
  startAt: string;

  @IsISO8601({}, { message: 'endAt harus tanggal ISO-8601' })
  endAt: string;

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
