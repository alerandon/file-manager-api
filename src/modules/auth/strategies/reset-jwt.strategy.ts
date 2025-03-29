import { Repository } from 'typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/modules/users/user.entity';
import { TJwtPayload } from '../auth.dto';

@Injectable()
export class ResetJwtStrategy extends PassportStrategy(Strategy, 'reset-jwt') {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  validate(payload: TJwtPayload) {
    if (payload.type !== 'reset-password') {
      throw new UnauthorizedException('Invalid token');
    }

    const rawUser = { id: payload.id, email: payload.email };
    return rawUser;
  }
}
