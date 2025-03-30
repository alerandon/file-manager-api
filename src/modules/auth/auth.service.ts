import * as dayjs from 'dayjs';
import { Resend } from 'resend';
import { MoreThan, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
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
    private readonly jwtService: JwtService,
  ) {}

  login(reqUser: User) {
    const authToken = generateAuthToken(reqUser, this.jwtService);
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
    const response = this.login(user);
    return response;
  }

  async register(data: RegisterDto) {
    const errorMessage =
      'The registration could not be completed. Please verify your data.';
    const { email } = data;

    const existingUser = await this.usersRepository.findOneBy({ email });
    if (existingUser) {
      throw new HttpException(errorMessage, HttpStatus.CONFLICT);
    }

    const user = this.usersRepository.create(data);
    await this.usersRepository.save(user);

    const token = generateAuthToken(user, this.jwtService);

    const response = { token, user };
    return response;
  }

  async resetPassword(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException(
        'The user with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const token = generateResetToken(user, this.jwtService);
    const pinCode = generatePinCode();
    const timeExpiration = dayjs().add(10, 'minutes').toDate();

    user.resetCode = pinCode;
    user.resetCodeExpiration = timeExpiration;
    await this.usersRepository.save(user);

    const htmlContent = `
      <html>
      <body>
        <h1>Reset Password</h1>
        <p>Your verification code is:</p>
        <h2>${pinCode}</h2>
        <p>Enter this code to reset your password. You have 10 minutes to use this code.</p>
      </body>
      </html>
    `;
    await this.resend.emails.send({
      from: 'no-reply@resend.dev',
      to: email,
      subject: 'Verification Code to Reset Password',
      html: htmlContent,
    });

    const response = { token, pinCode, timeExpiration };
    return response;
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
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    user.password = body.newPassword;
    user.resetCode = null;
    user.resetCodeExpiration = null;
    await this.usersRepository.save(user);

    const response = { success: true };
    return response;
  }
}
