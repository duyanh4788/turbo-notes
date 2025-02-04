import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum StatusType {
  ACTIVE = 'active',
  PENDING = 'pending',
  INACTIVE = 'inactive',
  BANNED = 'banned',
  DELETED = 'deleted',
}

export enum NotesType {
  CODE = 'code',
  string = 'string',
  SCHEDULE = 'schedule',
}

export class CNotesDto {
  @ApiProperty({ required: true })
  @IsString()
  label: string;
}

export class UNotesDto {
  @ApiProperty({ required: true })
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  label: string;

  @ApiProperty()
  @IsEnum(StatusType)
  @IsOptional()
  status?: StatusType;
}

export class ChildNotesDto {
  @ApiProperty({ required: true })
  @IsString()
  parentId: string;

  @ApiProperty()
  @IsString()
  label: string;
}
