import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../src/modules/auth/auth.service';
import { UsersService } from '../../src/modules/users/user.service';

describe('AuthService', () => {
  let service: AuthService;
  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };
  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateOAuthUser', () => {
    it('should return existing user', async () => {
      const user = { id: '1', email: 'test@test.com', name: 'Test User' };
      mockUsersService.findByEmail.mockResolvedValue(user);
      expect(
        await service.validateOAuthUser({ email: 'test@test.com' }),
      ).toEqual(user);
    });
  });
});
