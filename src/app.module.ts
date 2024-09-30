import { ConfigModule, ConfigService } from '@nestjs/config';  
import { TypeOrmModule } from '@nestjs/typeorm';  
import { TaskModule } from './task/task.module';  
import { AuthModule } from './auth/auth.module';  
import { CacheModule } from '@nestjs/cache-manager';  
import { ThrottlerModule } from '@nestjs/throttler';  
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';  
import { LoggingMiddleware } from './common/middleware/logging.middleware';  
import { redisStore } from 'cache-manager-redis-yet';

@Module({  
  imports: [  
    ConfigModule.forRoot({ isGlobal: true }),  
    TypeOrmModule.forRootAsync({  
      imports: [ConfigModule],  
      useFactory: (configService: ConfigService) => ({  
        type: 'mysql',  
        host: configService.get<string>('DB_HOST'),  
        port: parseInt(configService.get<string>('DB_PORT'), 10) || 3306,  
        username: configService.get<string>('DB_USER'),  
        password: configService.get<string>('DB_PASSWORD'),  
        database: configService.get<string>('DB_NAME'),  
        entities: [__dirname + '/**/*.entity{.ts,.js}'],  
        synchronize: true, 
      }),  
      inject: [ConfigService],  
    }),  
    CacheModule.registerAsync({  
      imports: [ConfigModule],  
      useFactory: (configService: ConfigService) => ({  
        store: '', 
        host: configService.get<string>('REDIS_HOST'),  
        port: configService.get<number>('REDIS_PORT'),  
        ttl: 60, 
        max: 100,  
      }),  
      inject: [ConfigService],  
      isGlobal: true,  
    }),  
    ThrottlerModule.forRoot(),  
    TaskModule,  
    AuthModule,  
  ],  
  controllers: [],  
  providers: [],  
})  
export class AppModule implements NestModule {  
  configure(consumer: MiddlewareConsumer) {  
    consumer.apply(LoggingMiddleware).forRoutes('*');  
  }  
}