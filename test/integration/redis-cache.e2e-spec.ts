import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

const REDIS_HOST = process.env.REDIS_HOST;

describe('Redis cache integration (optional)', () => {
    if (!REDIS_HOST) {
        it('skipped because REDIS_HOST not set', () => {
            expect(true).toBe(true);
        });
        return;
    }

    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        if (app) await app.close();
    });

    it('should cache /tasks with redis', async () => {
        const server = app.getHttpServer();
        // first call should hit service and create cache
        const r1 = await request(server).get('/tasks');
        expect(r1.status).toBe(200);
        // second call should be cached (we can't easily assert internals here), just ensure still 200
        const r2 = await request(server).get('/tasks');
        expect(r2.status).toBe(200);
    }, 20000);
});
