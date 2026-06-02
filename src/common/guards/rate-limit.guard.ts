import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

type Entry = { count: number; expiresAt: number };

@Injectable()
export class RateLimitGuard implements CanActivate {
    private store = new Map<string, Entry>();
    private ttl: number;
    private limit: number;

    constructor() {
        this.ttl = Number(process.env.RATE_LIMIT_TTL ?? 60); // seconds
        this.limit = Number(process.env.RATE_LIMIT_MAX ?? 100);
    }

    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<Request>();
        const key = this.keyForRequest(req);
        const now = Date.now();
        const entry = this.store.get(key);

        if (!entry || entry.expiresAt <= now) {
            this.store.set(key, { count: 1, expiresAt: now + this.ttl * 1000 });
            return true;
        }

        if (entry.count >= this.limit) {
            return false;
        }

        entry.count += 1;
        this.store.set(key, entry);
        return true;
    }

    private keyForRequest(req: Request) {
        // Rate limit by IP + route for simplicity
        return `${req.ip}:${req.method}:${req.path}`;
    }
}
