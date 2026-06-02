import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum TaskStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;
}
