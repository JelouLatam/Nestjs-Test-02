import { AppConfigService } from './config.service';

describe('AppConfigService', () => {
    it('returns defaults when env not set', () => {
        const mockCs: any = { get: jest.fn().mockReturnValue(undefined) };
        const s = new AppConfigService(mockCs);
        expect(s.dbHost).toBe('mysql');
        expect(s.dbPort).toBe(3306);
        expect(s.dbUsername).toBe('appuser');
        expect(s.dbPassword).toBe('apppassword');
        expect(s.dbDatabase).toBe('appdb');
        expect(s.jwtSecret).toBe('changeme');
        expect(s.jwtExpiresIn).toBe('3600s');
    });

    it('reads values from ConfigService', () => {
        const mockCs: any = {
            get: jest.fn((k: string) => {
                const map: any = {
                    DB_HOST: 'h',
                    DB_PORT: '1234',
                    DB_USERNAME: 'u',
                    DB_PASSWORD: 'p',
                    DB_DATABASE: 'd',
                    JWT_SECRET: 's',
                    JWT_EXPIRES_IN: '1h',
                };
                return map[k];
            }),
        };
        const s = new AppConfigService(mockCs);
        expect(s.dbHost).toBe('h');
        expect(s.dbPort).toBe(1234);
        expect(s.dbUsername).toBe('u');
        expect(s.dbPassword).toBe('p');
        expect(s.dbDatabase).toBe('d');
        expect(s.jwtSecret).toBe('s');
        expect(s.jwtExpiresIn).toBe('1h');
    });
});
