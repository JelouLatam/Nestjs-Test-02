import { Module } from '@nestjs/common';
import { TaskController } from './modules/tasks/presentation/task.controller';
import { TaskService } from './modules/tasks/application/task.service';

@Module({
  imports: [],
  controllers: [TaskController],
  providers: [TaskService],
})
export class AppModule {}
