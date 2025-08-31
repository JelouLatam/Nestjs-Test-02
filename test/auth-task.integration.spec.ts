import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../src/modules/auth/auth.module';
import { TaskController } from '../src/modules/tasks/presentation/task.controller';
import { TaskService } from '../src/modules/tasks/application/task.service';
import { Task } from '../src/modules/tasks/domain/task.entity';
import { User } from '../src/modules/auth/domain/user.entity';
import { CacheModule } from '@nestjs/cache-manager';

describe('Auth & Task Integration (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Task, User],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Task, User]),
        AuthModule,
        CacheModule.register(),
      ],
      controllers: [TaskController],
      providers: [TaskService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a new user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'integrationuser',
        email: 'integration@example.com',
        password: 'password',
        firstName: 'Integration',
        lastName: 'User',
      })
      .expect(201);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.username).toBe('integrationuser');
  });

  it('should login and get JWT token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'integrationuser', password: 'password' })
      .expect(200);
    expect(res.body.data).toHaveProperty('access_token');
    jwtToken = res.body.data.access_token;
  });

  it('should create a task with JWT', async () => {
    const res = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ title: 'Integration Task', description: 'Test task' })
      .expect(201);
    expect(res.body.data.title).toBe('Integration Task');
  });

  it('should fail to create a task without JWT', async () => {
    await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Should Fail', description: 'No token' })
      .expect(401);
  });

  it('should update a task with JWT', async () => {
    const res = await request(app.getHttpServer())
      .put('/tasks/1')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ title: 'Updated Task', description: 'Updated desc' })
      .expect(200);
    expect(res.body.data.title).toBe('Updated Task');
  });

  it('should delete a task with JWT', async () => {
    await request(app.getHttpServer())
      .delete('/tasks/1')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
  });

  it('should fail with invalid JWT', async () => {
    await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', 'Bearer invalidtoken')
      .send({ title: 'Should Fail', description: 'Invalid token' })
      .expect(401);
  });

  it('should fail with expired JWT', async () => {
    const expiredToken =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiaW50ZWdyYXRpb251c2VyIiwiZXhwIjoxMDAwMDAwMDAwfQ.abc123';
    await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', expiredToken)
      .send({ title: 'Should Fail', description: 'Expired token' })
      .expect(401);
  });
});
