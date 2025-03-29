import { Resend } from 'resend';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthHelpers } from './auth.helpers';
import { AuthController } from './auth.controller';
import { User } from '../users/user.entity';

@Module({
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3h' },
    }),
  ],
  providers: [
    AuthService,
    AuthHelpers,
    {
      provide: 'Resend',
      useValue: new Resend(process.env.RESEND_API_KEY),
    },
  ],
  exports: [AuthService, AuthHelpers, 'Resend'],
})
export class AuthModule {}
