import { Resend } from 'resend';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { AuthHelpers } from './auth.helpers';
import { LoginDto, RegisterDto } from './auth.dto';
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
    const pinCode = this.authHelpers.generatePinCodeWithExpiration();

    const htmlContent = `
      <html>
        <body>
          <h1>Restablecer Contraseña</h1>
          <p>Tu código de verificación es:</p>
          <h2>${pinCode.code}</h2>
          <p>Introduce este código para restablecer tu contraseña. Tienes 10 minutos para ingresar este codigo</p>
        </body>
      </html>
    `;
    await this.resend.emails.send({
      from: 'no-reply@resend.dev',
      to: email,
      subject: 'Código de Verificación para Restablecer Contraseña',
      html: htmlContent,
    });

    return { token, pinCode };
  }
}
