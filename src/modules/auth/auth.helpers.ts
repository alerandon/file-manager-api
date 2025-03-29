import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthHelpers {
  constructor(private readonly jwtService: JwtService) {}

  generatePinCode() {
    const min = 100000; // Minimum value for a 6-digit code
    const max = 999999; // Maximum value for a 6-digit code
    const codeFormula = min + Math.random() * (max - min + 1);
    const pinCode = Math.floor(codeFormula).toString();
    return pinCode;
  }

  generateTimeExpiration(minutes: number = 10) {
    const minutesTime = minutes * 60 * 1000;
    const expirationTime = new Date(Date.now() + minutesTime);
    return expirationTime;
  }

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
