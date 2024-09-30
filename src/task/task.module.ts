import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { WinstonModule } from 'nest-winston';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    WinstonModule,
  ],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
