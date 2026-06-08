import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Task } from '../../todos/entities/task.entity';

@Injectable()
export class MigrationService {
  private readonly logger = new Logger(MigrationService.name);

  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async cleanupOrphanedTasks() {
    try {
      // Find tasks without userId (orphaned tasks)
      const orphanedTasks = await this.taskRepository.find({
        where: { userId: IsNull() },
      });

      if (orphanedTasks.length > 0) {
        this.logger.warn(`Found ${orphanedTasks.length} orphaned tasks. Removing them...`);
        
        // Remove orphaned tasks
        await this.taskRepository.remove(orphanedTasks);
        
        this.logger.log(`Successfully removed ${orphanedTasks.length} orphaned tasks.`);
        return {
          message: `Removed ${orphanedTasks.length} orphaned tasks`,
          count: orphanedTasks.length,
        };
      } else {
        this.logger.log('No orphaned tasks found.');
        return {
          message: 'No orphaned tasks found',
          count: 0,
        };
      }
    } catch (error) {
      this.logger.error('Error during migration cleanup:', error);
      throw error;
    }
  }
}