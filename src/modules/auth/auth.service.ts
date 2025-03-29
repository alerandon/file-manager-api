import * as dayjs from 'dayjs';
import { Resend } from 'resend';
import { MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { ChangePasswordDto, RegisterDto } from './auth.dto';
import {
  generateAuthToken,
  generatePinCode,
  generateResetToken,
} from './auth.helpers';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject('Resend') private readonly resend: Resend,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  login(reqUser: User) {
    const authToken = generateAuthToken(reqUser);
    const response = { token: authToken, user: reqUser };
    return response;
  }

  async validateGoogleLogin(reqUser: User) {
    let user = await this.usersRepository.findOne({
      where: { email: reqUser.email },
    });

    const userExistsButNotFromGoogle = user && user.provider !== 'google';
    if (!user) {
      const params = { email: reqUser.email, provider: 'google' };
      user = this.usersRepository.create(params);
      await this.usersRepository.save(user);
    } else if (userExistsButNotFromGoogle) {
      user.provider = 'google';
      await this.usersRepository.save(user);
    }

    return this.login(user);
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

    const token = generateAuthToken(user);

    const response = { token, user };
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

    const token = generateResetToken(user);
    const pinCode = generatePinCode();
    const timeExpiration = dayjs().add(10, 'minutes').toDate();

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

  async changePassword(body: ChangePasswordDto, reqUser: User) {
    const actualDate = dayjs().toDate();
    const where = {
      email: reqUser.email,
      resetCode: body.pinCode,
      resetCodeExpiration: MoreThan(actualDate),
    };

    const user = await this.usersRepository.findOne({ where });
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    user.password = body.newPassword;
    user.resetCode = null;
    user.resetCodeExpiration = null;
    await this.usersRepository.save(user);

    return { success: true };
  }
}
