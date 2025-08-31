import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from './task-status.enum';

@Entity('tasks')
export class Task {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'My Task' })
  @Column()
  title: string;

  @ApiProperty({ example: 'Optional description', required: false })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({ example: 'PENDING', enum: TaskStatus })
  @Column({
    type: 'simple-enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @ApiProperty({ example: '2025-08-31T12:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2025-08-31T12:00:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}
