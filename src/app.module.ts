import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { createDatabaseConfig } from './config/database.config';
import { winstonConfig } from './config/logger.config';
import { createCacheConfig } from './config/cache.config';
import { HttpLoggerMiddleware } from './common/middleware';
import { CustomLoggerService } from './common/logger';


@Module({
  imports: [
    TodosModule,
    AuthModule,
    CommonModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    WinstonModule.forRoot(winstonConfig),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: createCacheConfig,
      inject: [ConfigService],
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            name: 'default',
            ttl: 60000, // 1 minute
            limit: configService.get<number>('RATE_LIMIT_MAX') || 60, // 60 requests per minute
          },
        ],
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: createDatabaseConfig,
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    CustomLoggerService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpLoggerMiddleware)
      .forRoutes('*');
  }
}
