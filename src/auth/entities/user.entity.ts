import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Task } from '../../tasks/entities/task.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  async validatePassword(password: string): Promise<boolean> {
    try {
      const isMatch: boolean = await bcrypt.compare(password, this.password);
      return isMatch;
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return false;
    }
  }
}
