import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsEnum } from 'class-validator';

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
  title: string;
}

export class UNotesDto {
  @ApiProperty({ required: true })
  @IsInt()
  id: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsEnum(StatusType)
  @IsOptional()
  status?: StatusType;
}

export class ChildNotesDto {
  @ApiProperty({ required: true })
  @IsInt()
  parentId: number;

  @ApiProperty()
  @IsString()
  title: string;
}

export class GANotesDto {
  @ApiProperty()
  @IsOptional()
  skip: number;

  @ApiProperty()
  @IsOptional()
  limit: number;
}
