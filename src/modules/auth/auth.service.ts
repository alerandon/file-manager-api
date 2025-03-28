import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto, RegisterDto } from './auth.dto';
import { User } from '../users/user.entity';
import { AuthHelpers } from './auth.helpers';

@Injectable()
export class AuthService {
  constructor(
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
}
