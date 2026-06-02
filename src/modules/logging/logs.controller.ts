import { Controller, Get, Query, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { MongoClient } from 'mongodb';

@Controller('admin/logs')
export class LogsController {
    private client?: MongoClient;

    private buildUriFromEnv(): string | null {
        const host = process.env.MONGO_HOST;
        if (!host) return null;
        const port = process.env.MONGO_PORT ?? '27017';
        const user = process.env.MONGO_USER;
        const pass = process.env.MONGO_PASSWORD;
        if (user && pass) {
            return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}:${port}`;
        }
        return `mongodb://${host}:${port}`;
    }

    private async getClient() {
        if (this.client) return this.client;
        let uri = process.env.MONGO_URI;
        console.log('MONGO_URI:', uri ? '[REDACTED]' : 'not set');
        if (!uri) {
            console.log('Building MongoDB URI from environment variables');
            uri = this.buildUriFromEnv() ?? undefined as any;
        }
        if (!uri) {
            throw new BadRequestException('Missing Mongo configuration: set MONGO_URI or MONGO_HOST/MONGO_PORT');
        }

        try {
            this.client = new MongoClient(uri);
            await this.client.connect();
            return this.client;
        } catch (e) {
            throw new InternalServerErrorException('Failed to connect to MongoDB');
        }
    }

    @Get()
    async tail(@Query('limit') limit = '50') {
        const client = await this.getClient();
        const dbName = process.env.MONGO_DB ?? 'logs';
        const db = client.db(dbName);
        const coll = db.collection('app_logs');
        const l = Math.min(500, Number(limit) || 50);
        const docs = await coll.find().sort({ _id: -1 }).limit(l).toArray();
        return docs;
    }
}
