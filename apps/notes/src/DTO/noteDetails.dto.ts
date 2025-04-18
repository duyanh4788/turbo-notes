import { ApiProperty } from '@nestjs/swagger';
import { NoteDetailType, StatusType } from '@prisma/client';
import { IsString, IsOptional, IsInt, IsEnum } from 'class-validator';
import { PagingDto } from './paging.dto';

export class CNoteDetailsDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsString()
  noteId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  scheduleTime?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(NoteDetailType)
  type?: NoteDetailType;
}

export class UNoteDetailsDto {
  @IsInt()
  id: number;

  @ApiProperty()
  @IsString()
  noteId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  content: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  scheduleTime?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(StatusType)
  status?: StatusType;

  @ApiProperty()
  @IsOptional()
  @IsEnum(NoteDetailType)
  type?: NoteDetailType;
}

export class ParamsDto {
  @ApiProperty({ required: true })
  @IsString()
  id: number;

  @ApiProperty({ required: true })
  @IsString()
  noteId: string;
}

export class QueryDto extends PagingDto {
  @ApiProperty()
  @IsString()
  noteId: string;
}
