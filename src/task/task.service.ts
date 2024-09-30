import { Injectable, NotFoundException, Inject } from '@nestjs/common';  
import { CACHE_MANAGER } from '@nestjs/cache-manager';  
import { InjectRepository } from '@nestjs/typeorm';  
import { Repository } from 'typeorm';  
import { Task, TaskStatus } from './task.entity';  
import { CreateTaskDto } from './dto/create-task.dto';  
import { UpdateTaskDto } from './dto/update-task.dto';  
import { Cache } from 'cache-manager';  

@Injectable()  
export class TaskService {  
  constructor(  
    @InjectRepository(Task)  
    private readonly taskRepository: Repository<Task>,  
    @Inject(CACHE_MANAGER)  
    private cacheManager: Cache,  
  ) {}  

  async create(createTaskDto: CreateTaskDto): Promise<Task> {  
    const task = this.taskRepository.create(createTaskDto);  
    await this.taskRepository.save(task);  
    this.cacheManager.reset(); 
    return task;  
  }  

  async findAll(status?: TaskStatus): Promise<Task[]> {  
    let tasks: Task[];  

    const cacheKey = status ? `tasks_status_${status}` : 'tasks_all';  
    const cached: Task[] = await this.cacheManager.get<Task[]>(cacheKey);  
    if (cached) {  
      return cached;  
    }  

    if (status) {  
      tasks = await this.taskRepository.find({ where: { status } });  
    } else {  
      tasks = await this.taskRepository.find();  
    }  

    await this.cacheManager.set(cacheKey, tasks, 60); 
    return tasks;  
  }  

  async findOne(id: string): Promise<Task> {  
    const task = await this.taskRepository.findOne({ where: { id } });  
    if (!task) {  
      throw new NotFoundException(`Tarea con id ${id} no fue encontrada`);  
    }  
    return task;  
  }  

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {  
    const task = await this.findOne(id);  
    Object.assign(task, updateTaskDto);  
    await this.taskRepository.save(task);  
    this.cacheManager.reset();
    return task;  
  }  

  async remove(id: string): Promise<void> {  
    const task = await this.findOne(id);  
    await this.taskRepository.remove(task);  
    this.cacheManager.reset();
  }  

  async getTaskCounts(): Promise<{ completed: number; pending: number }> {  
    const completed = await this.taskRepository.count({ where: { status: TaskStatus.COMPLETED } });  
    const pending = await this.taskRepository.count({ where: { status: TaskStatus.PENDING } });  
    return { completed, pending };  
  }  
}