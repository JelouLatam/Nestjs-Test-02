export class UpdateTaskDto {
  title?: string;
  description?: string;
  status?: 'pending' | 'completed';
}
