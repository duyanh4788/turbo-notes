import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PagingDto {
  @ApiProperty()
  @IsOptional()
  skip: number;

  @ApiProperty()
  @IsOptional()
  limit: number;
}

export class SearchDto {
  @ApiProperty({ required: true })
  @IsString()
  text: string;
}

export class CountDto {
  @ApiProperty({ required: true })
  @IsString()
  noteId: string;
}
