import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

export type User = { id: number; username: string; passwordHash: string };

@Injectable()
export class UsersService {
    private users: User[] = [];
    private seq = 1;

    async create(username: string, password: string) {
        const passwordHash = await bcrypt.hash(password, 10);
        const user: User = { id: this.seq++, username, passwordHash };
        this.users.push(user);
        return { id: user.id, username: user.username };
    }

    async findByUsername(username: string) {
        return this.users.find((u) => u.username === username);
    }

    async validatePassword(user: User, password: string) {
        return bcrypt.compare(password, user.passwordHash);
    }
}
