import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { UserRole, StatusType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { TypeCount } from 'packages/common/constant';

export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsString()
  userName: string;

  @ApiProperty({ required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  tokenData?: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  tokenGg: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsEnum(StatusType)
  status?: StatusType;
}

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  userName?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  tokenData?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  tokenGg: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(StatusType)
  status?: StatusType;
}

export class CountNoteDto {
  @ApiProperty()
  @IsString()
  userId: number;

  @ApiProperty()
  @IsEnum(TypeCount)
  typeCount: TypeCount;
}

export class GetByIdDto {
  @ApiProperty()
  @IsString()
  userId: number;
}
