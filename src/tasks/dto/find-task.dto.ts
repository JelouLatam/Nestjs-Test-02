import { IsUUID } from 'class-validator';

export class FindTaskDto {
  @IsUUID()
  id: string;
}
