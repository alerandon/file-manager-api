import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Entity('users')
export class User {
  constructor(private readonly jwtService: JwtService) {}

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false, nullable: true })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await argon2.hash(this.password);
    }
  }

  async validatePassword(password: string) {
    const isValid = this.password
      ? await argon2.verify(this.password, password)
      : false;
    return isValid;
  }

  generateAuthToken() {
    const inputPayload = { id: this.id, email: this.email, type: 'auth' };
    const token = this.jwtService.sign(inputPayload);
    return token;
  }

  generateResetToken() {
    const inputPayload = {
      id: this.id,
      email: this.email,
      type: 'reset-password',
    };
    const token = this.jwtService.sign(inputPayload);
    return token;
  }
}
