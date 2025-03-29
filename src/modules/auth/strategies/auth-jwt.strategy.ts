import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from 'src/modules/users/user.entity';
import { TJwtPayload } from '../auth.dto';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy, 'auth-jwt') {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: TJwtPayload) {
    const errorMessage = 'Invalid token';
    if (payload.type !== 'auth') {
      throw new UnauthorizedException(errorMessage);
    }
    const user = await this.usersRepository.findOneBy({ email: payload.email });
    if (!user) throw new UnauthorizedException(errorMessage);

    return user;
  }
}
