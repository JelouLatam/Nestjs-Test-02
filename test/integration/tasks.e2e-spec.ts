import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TasksModule } from '../../src/modules/task/tasks.module';
import { TasksService } from '../../src/modules/task/tasks.service';
import { TaskStatus } from '../../src/modules/task/tasks.entity';

describe('Tasks (integration)', () => {
    let app: INestApplication;
    let service: Partial<TasksService>;

    beforeAll(async () => {
        service = {
            findAllWithPagination: jest.fn().mockResolvedValue({
                items: [{ id: 1, title: 'a', description: null, status: TaskStatus.PENDING }],
                meta: { total: 1, page: 1, limit: 10, completed: 0, pending: 1 },
            }),
        };

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [TasksModule],
        })
            .overrideProvider(TasksService as any)
            .useValue(service)
            .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/GET tasks (ok)', async () => {
        const res = await request(app.getHttpServer()).get('/tasks');
        expect(res.status).toBe(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.meta).toBeDefined();
    });

    it('/GET tasks (invalid status) -> 400', async () => {
        const res = await request(app.getHttpServer()).get('/tasks?status=complete');
        expect(res.status).toBe(400);
        expect(res.body.status).toBe('error');
        expect(res.body.message).toMatch(/status must be one of/);
    });
});
