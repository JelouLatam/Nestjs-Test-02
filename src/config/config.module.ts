import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './config.service';
import { validate } from './environment.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      // Optionally, specify the path to your env file if not in the root
      // envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true, // Makes ConfigModule available globally
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule { }
