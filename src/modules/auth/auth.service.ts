import * as jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import { MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { AuthHelpers } from './auth.helpers';
import {
  ChangePasswordDto,
  LoginDto,
  RegisterDto,
  TJwtPayload,
} from './auth.dto';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject('Resend') private readonly resend: Resend,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly authHelpers: AuthHelpers,
  ) {}

  async login(data: LoginDto) {
    const errorMessage = 'Las credenciales son invalidas';
    const { email, password } = data;

    const user = await this.usersRepository.findOneBy({ email });
    if (!user) throw new HttpException(errorMessage, HttpStatus.UNAUTHORIZED);

    const validatedPassword = await user.validatePassword(password);
    if (!validatedPassword)
      throw new HttpException(errorMessage, HttpStatus.UNAUTHORIZED);

    const token = this.authHelpers.generateAuthToken(user);
    const response = { data: { token, user } };
    return response;
  }

  async register(data: RegisterDto) {
    const errorMessage =
      'No se pudo completar el registro. Por favor, verifica tus datos.';
    const { email } = data;

    const existingUser = await this.usersRepository.findOneBy({ email });
    if (existingUser)
      throw new HttpException(errorMessage, HttpStatus.CONFLICT);

    const user = this.usersRepository.create(data);
    await this.usersRepository.save(user);

    const token = this.authHelpers.generateAuthToken(user);

    const response = { data: { token, user } };
    return response;
  }

  async resetPassword(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException(
        'El usuario con este correo no existe',
        HttpStatus.NOT_FOUND,
      );
    }

    const token = this.authHelpers.generateResetToken(user);
    const pinCode = this.authHelpers.generatePinCode();
    const timeExpiration = this.authHelpers.generateTimeExpiration();

    user.resetCode = pinCode;
    user.resetCodeExpiration = timeExpiration;
    await this.usersRepository.save(user);

    const htmlContent = `
      <html>
        <body>
          <h1>Restablecer Contraseña</h1>
          <p>Tu código de verificación es:</p>
          <h2>${pinCode}</h2>
          <p>Introduce este código para restablecer tu contraseña. Tienes 10 minutos para ingresar este código</p>
        </body>
      </html>
    `;
    await this.resend.emails.send({
      from: 'no-reply@resend.dev',
      to: email,
      subject: 'Código de Verificación para Restablecer Contraseña',
      html: htmlContent,
    });

    return { token, pinCode, timeExpiration };
  }

  async changePassword(body: ChangePasswordDto) {
    const decodedToken = jwt.verify(
      body.resetToken,
      process.env.JWT_SECRET!,
    ) as TJwtPayload;
    if (decodedToken.type !== 'reset-password') {
      throw new HttpException(
        'El token no es válido para restablecer la contraseña',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.usersRepository.findOne({
      where: {
        id: decodedToken.id,
        resetCode: body.pinCode,
        resetCodeExpiration: MoreThan(new Date()),
      },
    });
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    user.password = body.newPassword;
    user.resetCode = null;
    user.resetCodeExpiration = null;
    await this.usersRepository.save(user);

    return { message: 'Contraseña actualizada exitosamente' };
  }
}
