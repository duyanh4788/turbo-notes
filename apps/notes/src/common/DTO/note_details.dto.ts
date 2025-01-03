import { IsString, IsOptional, IsInt, IsDate } from 'class-validator';

export class CNoteDetailsDto {
  @IsString()
  content: string;

  @IsDate()
  scheduleTime: Date;

  @IsString()
  @IsOptional()
  status?: string;
}

export class UNoteDetailsDto {
  @IsInt()
  id: number;

  @IsString()
  content: string;

  @IsDate()
  scheduleTime: Date;

  @IsString()
  @IsOptional()
  status?: string;
}
