import { User } from '../users/user.entity';

export function generatePinCode() {
  const min = 100000; // Minimum value for a 6-digit code
  const max = 999999; // Maximum value for a 6-digit code
  const codeFormula = min + Math.random() * (max - min + 1);
  const pinCode = Math.floor(codeFormula).toString();
  return pinCode;
}

export function generateAuthToken(user: User) {
  const inputPayload = { id: user.id, email: user.email, type: 'auth' };
  const token = this.jwtService.sign(inputPayload);
  return token;
}

export function generateResetToken(user: User) {
  const inputPayload = {
    id: user.id,
    email: user.email,
    type: 'reset-password',
  };
  const token = this.jwtService.sign(inputPayload);
  return token;
}
