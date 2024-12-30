import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { UserRole, StatusType } from '@prisma/client';

export class CreateUserDto {
    @IsString()
    userName: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    tokenData?: string;

    @IsOptional()
    @IsString()
    tokenGg: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsOptional()
    @IsEnum(StatusType)
    status?: StatusType;
}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    userName?: string;

    @IsOptional()
    @IsString()
    tokenData?: string;

    @IsOptional()
    @IsString()
    tokenGg: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsOptional()
    @IsEnum(StatusType)
    status?: StatusType;
}