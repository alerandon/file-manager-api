import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthHelpers {
  constructor(private readonly jwtService: JwtService) {}

  generateAuthToken(user: User) {
    const inputPayload = { id: user.id, email: user.email, type: 'auth' };
    const token = this.jwtService.sign(inputPayload);
    return token;
  }

  generateResetToken(user: User) {
    const inputPayload = {
      id: user.id,
      email: user.email,
      type: 'reset-password',
    };
    const token = this.jwtService.sign(inputPayload);
    return token;
  }
}
