import { Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) { }

    async validateUser(username: string, pass: string) {
        const user = await this.usersService.findByUsername(username);
        if (!user) return null;
        const ok = await this.usersService.validatePassword(user, pass);
        if (!ok) return null;
        return { id: user.id, username: user.username };
    }

    async login(user: { id: number; username: string }) {
        const payload = { sub: user.id, username: user.username };
        return { access_token: this.jwtService.sign(payload) };
    }
}
