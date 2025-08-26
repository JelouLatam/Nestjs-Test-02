import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MigrationService } from '../utils/migration.service';

@ApiTags('Migration')
@Controller('migration')
export class MigrationController {
  constructor(private readonly migrationService: MigrationService) {}

  @Post('cleanup-orphaned-tasks')
  @ApiOperation({ 
    summary: 'Clean up orphaned tasks (tasks without userId)',
    description: 'This is a one-time migration endpoint to clean up tasks created before authentication was implemented.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Cleanup completed successfully',
    schema: {
      example: {
        message: 'Removed 5 orphaned tasks',
        count: 5
      }
    }
  })
  async cleanupOrphanedTasks() {
    return this.migrationService.cleanupOrphanedTasks();
  }
}