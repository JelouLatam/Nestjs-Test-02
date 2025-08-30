export class Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}
