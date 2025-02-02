/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { JwtStrategy } from '../strategies/jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  const MOCK_USER_ID = '289c9b37-5d32-4411-825b-3fb042f6b749';
  const MOCK_USER_EMAIL = 'updavo@gmail.com';

  const mockUserRepository = {
    findOne: jest.fn().mockResolvedValue(null),
  };

  const jwtStrategy = new JwtStrategy(
    { get: () => 'secret' } as any,
    mockUserRepository as any,
  );

  it('debería lanzar un error si el usuario no existe', async () => {
    await expect(
      jwtStrategy.validate({ sub: MOCK_USER_ID, email: MOCK_USER_EMAIL }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
