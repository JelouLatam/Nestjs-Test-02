import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger setup
  const { SwaggerModule, DocumentBuilder } = await import('@nestjs/swagger');
  const config = new DocumentBuilder()
    .setTitle('ToDo Task API')
    .setDescription(
      `Jelou NestJS-Test-02 API

This API allows you to manage tasks and users. To access protected endpoints, first register and login to obtain a JWT token, then use the Authorize button in Swagger UI.`,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      tagsSorter: (a, b) => {
        if (a === 'auth') return -1;
        if (b === 'auth') return 1;
        return a.localeCompare(b);
      },
    },
  });

  await app.listen(3000);
}
bootstrap();
