import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { UserRole, StatusType } from '@prisma/client';

export class CreateUserDto {
    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    tokengg: string;

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
    username?: string;

    @IsOptional()
    @IsString()
    tokengg: string;

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