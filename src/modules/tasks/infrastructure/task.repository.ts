import { Task } from '../domain/task.entity';

export abstract class TaskRepository {
  abstract findAll(): Promise<Task[]>;
  abstract findById(id: number): Promise<Task | null>;
  abstract create(task: Task): Promise<Task>;
  abstract update(id: number, task: Partial<Task>): Promise<Task>;
  abstract delete(id: number): Promise<void>;
}
