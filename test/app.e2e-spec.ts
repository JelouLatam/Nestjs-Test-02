import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { testDatabaseConfig } from '../src/test/test.config';
import { TaskStatus } from '../src/todos/dtos/create-todo.dto';

describe('Todo App (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let userId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        // Override database config for testing
        TypeOrmModule.forRoot(testDatabaseConfig),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Set up same pipes as main app
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication Flow', () => {
    const testUser = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.email).toBe(testUser.email);
          expect(res.body.user).not.toHaveProperty('password');
          
          // Save token and user ID for other tests
          jwtToken = res.body.access_token;
          userId = res.body.user.id;
        });
    });

    it('should not register user with duplicate email', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(409)
        .expect((res) => {
          expect(res.body.message).toContain('User with this email already exists');
        });
    });

    it('should login with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.email).toBe(testUser.email);
        });
    });

    it('should not login with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toContain('Invalid credentials');
        });
    });

    it('should get user profile with valid token', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(userId);
          expect(res.body.email).toBe(testUser.email);
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should not get profile without token', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .expect(401);
    });
  });

  describe('Tasks CRUD Operations', () => {
    const testTask = {
      title: 'Test Task',
      description: 'This is a test task',
      status: TaskStatus.PENDING,
    };

    let taskId: number;

    it('should create a new task', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(testTask)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe(testTask.title);
          expect(res.body.description).toBe(testTask.description);
          expect(res.body.status).toBe(testTask.status);
          expect(res.body.userId).toBe(userId);
          
          taskId = res.body.id;
        });
    });

    it('should not create task without authentication', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send(testTask)
        .expect(401);
    });

    it('should not create task with invalid data', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          // Missing required title
          description: 'Task without title',
        })
        .expect(400);
    });

    it('should get all tasks for authenticated user', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('tasks');
          expect(res.body).toHaveProperty('summary');
          expect(Array.isArray(res.body.tasks)).toBe(true);
          expect(res.body.tasks.length).toBeGreaterThan(0);
          expect(res.body.summary.total).toBeGreaterThan(0);
        });
    });

    it('should get tasks with pagination', () => {
      return request(app.getHttpServer())
        .get('/tasks?page=1&limit=5')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('pagination');
          expect(res.body.pagination.currentPage).toBe(1);
          expect(res.body.pagination.itemsPerPage).toBe(5);
        });
    });

    it('should get tasks filtered by status', () => {
      return request(app.getHttpServer())
        .get(`/tasks?status=${TaskStatus.PENDING}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.tasks.every(task => task.status === TaskStatus.PENDING)).toBe(true);
        });
    });

    it('should get specific task by id', () => {
      return request(app.getHttpServer())
        .get(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(taskId);
          expect(res.body.title).toBe(testTask.title);
          expect(res.body.userId).toBe(userId);
        });
    });

    it('should not get task that does not exist', () => {
      return request(app.getHttpServer())
        .get('/tasks/99999')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);
    });

    it('should update task', () => {
      const updateData = {
        title: 'Updated Task Title',
        status: TaskStatus.COMPLETED,
      };

      return request(app.getHttpServer())
        .put(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(taskId);
          expect(res.body.title).toBe(updateData.title);
          expect(res.body.status).toBe(updateData.status);
          expect(res.body.description).toBe(testTask.description); // Should remain unchanged
        });
    });

    it('should not update task that does not exist', () => {
      return request(app.getHttpServer())
        .put('/tasks/99999')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ title: 'Updated Title' })
        .expect(404);
    });

    it('should delete task', () => {
      return request(app.getHttpServer())
        .delete(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(taskId);
        });
    });

    it('should not delete task that does not exist', () => {
      return request(app.getHttpServer())
        .delete('/tasks/99999')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);
    });

    it('should not access tasks without authentication', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .expect(401);
    });
  });

  describe('Rate Limiting', () => {
    it('should respect rate limits on registration', async () => {
      const requests = [];
      
      // Make 6 registration requests (limit is 5 per minute)
      for (let i = 0; i < 6; i++) {
        requests.push(
          request(app.getHttpServer())
            .post('/auth/register')
            .send({
              email: `test${i}@example.com`,
              password: 'password123',
              firstName: 'Test',
              lastName: 'User',
            })
        );
      }

      const results = await Promise.all(requests);
      
      // First 5 should succeed (201) or fail with business logic (409)
      // 6th should be rate limited (429)
      const rateLimitedRequests = results.filter(res => res.status === 429);
      expect(rateLimitedRequests.length).toBeGreaterThan(0);
    }, 10000); // Increase timeout for this test
  });
});
