import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { loadConfig } from './config/config-loader';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => loadConfig(process.env.NODE_ENV || 'local')],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 3306),
        username: configService.get<string>('DATABASE_USER', 'root'),
        password: configService.get<string>('DATABASE_PASSWORD', ''),
        database: configService.get<string>('DATABASE_NAME', 'testdb'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST', '127.0.0.1'),
        port: configService.get<number>('REDIS_PORT', 6379),
        db: configService.get<number>('REDIS_DB', 1),
        ttl: 60,
      }),
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: 10,
          ttl: 60,
        },
      ],
    }),
    TasksModule,
    AuthModule,
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
