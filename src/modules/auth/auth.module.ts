import { Resend } from 'resend';
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthJwtStrategy } from './strategies/auth-jwt.strategy';
import { ResetJwtStrategy } from './strategies/reset-jwt.strategy';
import { User } from '../users/user.entity';

@Module({
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ session: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3h' },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    AuthJwtStrategy,
    ResetJwtStrategy,
    GoogleStrategy,
    {
      provide: 'Resend',
      useValue: new Resend(process.env.RESEND_API_KEY),
    },
  ],
  exports: [AuthService, 'Resend'],
})
export class AuthModule {}
