import { AuthService } from './auth.service';

describe('AuthService', () => {
    it('validateUser returns user payload when credentials correct', async () => {
        const mockUsers: any = {
            findByUsername: jest.fn().mockResolvedValue({ id: 1, username: 'u', passwordHash: 'x' }),
            validatePassword: jest.fn().mockResolvedValue(true),
        };
        const mockJwt: any = { sign: jest.fn().mockReturnValue('token') };
        const svc = new AuthService(mockUsers, mockJwt);
        const res = await svc.validateUser('u', 'pass');
        expect(res).toEqual({ id: 1, username: 'u' });
    });

    it('validateUser returns null when password invalid', async () => {
        const mockUsers: any = {
            findByUsername: jest.fn().mockResolvedValue({ id: 1, username: 'u', passwordHash: 'x' }),
            validatePassword: jest.fn().mockResolvedValue(false),
        };
        const mockJwt: any = { sign: jest.fn() };
        const svc = new AuthService(mockUsers, mockJwt);
        const res = await svc.validateUser('u', 'bad');
        expect(res).toBeNull();
    });

    it('login returns token', async () => {
        const mockUsers: any = {};
        const mockJwt: any = { sign: jest.fn().mockReturnValue('tok') };
        const svc = new AuthService(mockUsers, mockJwt);
        const out = await svc.login({ id: 2, username: 'x' } as any);
        expect(out).toEqual({ access_token: 'tok' });
    });
});
