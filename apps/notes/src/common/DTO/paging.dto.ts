import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PagingDto {
  @ApiProperty()
  @IsOptional()
  skip: number;

  @ApiProperty()
  @IsOptional()
  limit: number;
}
