// src/config/database.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const createDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: configService.get<string>('DB_TYPE') === 'mysql' ? 'mysql' : 'sqlite',
  database: configService.get<string>('DATABASE_NAME'),
  // Si el tipo es MySQL, añade las credenciales
  ...(configService.get<string>('DB_TYPE') === 'mysql' && {
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    username: configService.get<string>('DATABASE_USERNAME'),
    password: configService.get<string>('DATABASE_PASSWORD'),
  }),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'], // Se adapta a la nueva estructura
  logging: false,
  synchronize: true, // ¡Solo usar en desarrollo!
});