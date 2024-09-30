import { NestFactory } from '@nestjs/core';  
import { AppModule } from './app.module';  
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';  

async function bootstrap() {  
  const app = await NestFactory.create(AppModule);  

  const config = new DocumentBuilder()  
    .setTitle('To-Do List API')  
    .setDescription('API para gestionar tareas')  
    .setVersion('1.0')  
    .addBearerAuth()  
    .build();  
  
  const document = SwaggerModule.createDocument(app, config);  
  SwaggerModule.setup('api', app, document);  

  const port = process.env.PORT || 3000;  
  await app.listen(port);  

  console.info(`Application is running on: http://localhost:${port}`);  
  console.info(`Swagger docs available at: http://localhost:${port}/api`);  
}  
bootstrap();