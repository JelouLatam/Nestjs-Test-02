import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MigrationController } from './controllers/migration.controller';
import { MigrationService } from './utils/migration.service';
import { CacheService } from './services/cache.service';
import { Task } from '../todos/entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [MigrationController],
  providers: [MigrationService, CacheService],
  exports: [MigrationService, CacheService],
})
export class CommonModule {}