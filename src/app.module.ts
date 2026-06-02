import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from './config/config.module';
import { AppConfigService } from './config/config.service';
import { TasksModule } from './modules/task/tasks.module';
import { AuthModule } from './modules/auth/auth.module';
import { RateLimitGuard } from './common/guards/rate-limit.guard';
import { APP_GUARD } from '@nestjs/core';
import { CacheModule } from './common/cache/cache.module';
import { CacheInterceptor } from './common/interceptors/cache.interceptor';
import { RequestLoggingMiddleware } from './common/middleware/request-logging.middleware';
import { LoggingModule } from './modules/logging/logging.module';
import { LogsModule } from './modules/logging/logs.module';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => {
        return {
          type: 'mysql',
          host: configService.dbHost,
          port: configService.dbPort,
          username: configService.dbUsername,
          password: configService.dbPassword,
          database: configService.dbDatabase,
          // Let TypeORM automatically load entities registered with forFeature
          autoLoadEntities: true,
          synchronize: true, // Shouldn't be used in production
        };
      },
    }),
    TasksModule,
    CacheModule,
    // register auth module so JwtStrategy and JwtModule are available
    AuthModule,
    LoggingModule,
    ...(process.env.NODE_ENV === 'production' ? [] : [LogsModule]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: RateLimitGuard },
    CacheInterceptor,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
