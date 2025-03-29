import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Validate,
  IsNotEmpty,
} from 'class-validator';
import { Match } from 'src/validators/match.validator';

export class LoginDto {
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(128, {
    message: 'La contraseña no debe exceder los 128 caracteres',
  })
  password: string;
}

export class RegisterDto {
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(128, {
    message: 'La contraseña no debe exceder los 128 caracteres',
  })
  password: string;

  @IsString({
    message: 'La confirmación de contraseña debe ser un texto válido',
  })
  @MinLength(6, {
    message: 'La confirmación de contraseña debe tener al menos 6 caracteres',
  })
  @MaxLength(128, {
    message: 'La confirmación de contraseña no debe exceder los 128 caracteres',
  })
  // FIXME: Pending to get working the Match validator
  @Validate(Match, ['password'], { message: 'Passwords do not match' })
  confirmPassword: string;
}

export class ResetPasswordDto {
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  email: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  resetToken: string;

  @IsString()
  @MinLength(6, { message: 'El codigo debe tener minimo 6 caracteres' })
  pinCode: string;

  @IsString()
  @MinLength(6, {
    message: 'La confirmación de contraseña debe tener al menos 6 caracteres',
  })
  @MaxLength(128, {
    message: 'La confirmación de contraseña no debe exceder los 128 caracteres',
  })
  newPassword: string;

  @IsString()
  @MinLength(6, {
    message: 'La confirmación de contraseña debe tener al menos 6 caracteres',
  })
  @MaxLength(128, {
    message: 'La confirmación de contraseña no debe exceder los 128 caracteres',
  })
  // FIXME: Pending to get working the Match validator
  @Validate(Match, ['password'], { message: 'Passwords do not match' })
  confirmNewPassword: string;
}

export type TJwtPayload = {
  id: string;
  email: string;
  type: 'auth' | 'reset-password';
};
