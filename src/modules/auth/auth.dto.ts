import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Validate,
} from 'class-validator';
import { Match } from '../../validators/match.validator';

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Must be a valid email address' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'StrongP@ssw0rd',
    format: 'password',
  })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(128, {
    message: 'Password must not exceed 128 characters',
  })
  password: string;

  @ApiProperty({
    description: 'Password confirmation',
    example: 'StrongP@ssw0rd',
    format: 'password',
  })
  @IsString({
    message: 'Password confirmation must be a valid string',
  })
  @MinLength(6, {
    message: 'Password confirmation must be at least 6 characters long',
  })
  @MaxLength(128, {
    message: 'Password confirmation must not exceed 128 characters',
  })
  @Match('password', { message: 'Passwords must match' })
  confirmPassword: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'User email address to reset the password',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Must be a valid email address' })
  email: string;
}

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Pin code for password change',
    example: '123456',
    format: 'string',
  })
  @IsString()
  @MinLength(6, { message: 'The pin code must be at least 6 characters long' })
  pinCode: string;

  @ApiProperty({
    description: 'New password for the user',
    example: 'StrongP@ssw0rd',
    format: 'password',
  })
  @IsString()
  @MinLength(6, {
    message: 'The new password must be at least 6 characters long',
  })
  @MaxLength(128, {
    message: 'The new password must not exceed 128 characters',
  })
  newPassword: string;

  @ApiProperty({
    description: 'Confirmation of the new password',
    example: 'StrongP@ssw0rd',
    format: 'password',
  })
  @IsString()
  @MinLength(6, {
    message: 'The password confirmation must be at least 6 characters long',
  })
  @MaxLength(128, {
    message: 'The password confirmation must not exceed 128 characters',
  })
  @Match('newPassword', { message: 'Passwords must match' })
  confirmNewPassword: string;
}

export type TJwtPayload = {
  id: string;
  email: string;
  type: 'auth' | 'reset-password';
};
