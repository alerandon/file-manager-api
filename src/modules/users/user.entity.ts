import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import * as argon2 from 'argon2';
import { File } from '../files/file.entity'; // Asegúrate de que esta ruta sea correcta

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => File, (file) => file.user)
  files: File[];

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
}
