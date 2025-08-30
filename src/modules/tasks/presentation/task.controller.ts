import { Controller, Get } from '@nestjs/common';

@Controller('tasks')
export class TaskController {
  @Get()
  getAllTasks() {
    return { message: 'El endpoint /tasks funciona correctamente.' };
  }
}
