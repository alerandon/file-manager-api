import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['files'],
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const response = { data: { ...user } };
    return response;
  }
}
