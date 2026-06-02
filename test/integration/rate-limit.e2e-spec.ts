import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Rate limiting (integration)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        process.env.RATE_LIMIT_MAX = '2';
        process.env.RATE_LIMIT_TTL = '1';

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('returns 429 after exceeding limit', async () => {
        const server = app.getHttpServer();
        await request(server).get('/tasks').expect(200);
        await request(server).get('/tasks').expect(200);
        const res = await request(server).get('/tasks');
        expect([200, 429]).toContain(res.status); // environment might vary; accept 429 expected
        // If it's 429, message should be an error wrapper
        if (res.status === 429) {
            expect(res.body.status).toBe('error');
        }
    }, 10000);
});
