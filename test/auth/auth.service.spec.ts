import * as dayjs from 'dayjs';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../src/modules/users/user.entity';
import { AuthService } from '../../src/modules/auth/auth.service';
import { ChangePasswordDto } from 'src/modules/auth/auth.dto';

describe('AuthService', () => {
  let service: AuthService;
  const mockJwtService = {
    sign: jest.fn(),
  };
  const mockUsersRepository = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn((user) => Promise.resolve(user)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'UserRepository',
          useValue: mockUsersRepository,
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

  describe('validateGoogleLogin', () => {
    it('should create a new user if not exists', async () => {
      const reqUser = { email: 'google@test.com', provider: 'google' } as User;
      mockUsersRepository.findOne.mockResolvedValue(null);
      mockUsersRepository.create.mockResolvedValue(reqUser);
      mockUsersRepository.save.mockResolvedValue(reqUser);

      const result = await service.validateGoogleLogin(reqUser);
      expect(result.user).toEqual(reqUser);
      expect(mockUsersRepository.create).toHaveBeenCalledWith({
        email: reqUser.email,
        provider: 'google',
      });
    });

    it('should update provider if user exists but not from Google', async () => {
      const existingUser = { email: 'test@test.com' } as User;
      mockUsersRepository.findOne.mockResolvedValue(existingUser);
      mockUsersRepository.save.mockImplementation((user) => {
        user.provider = 'google';
        return user;
      });

      const result = await service.validateGoogleLogin(existingUser);
      expect(result.user.provider).toBe('google');
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const data = {
        email: 'new@test.com',
        password: 'password123',
        confirmPassword: 'password123',
      };
      mockUsersRepository.findOneBy.mockResolvedValue(null);
      mockUsersRepository.create.mockResolvedValue(data);
      mockUsersRepository.save.mockResolvedValue(data);

      const result = await service.register(data);
      expect(result.user).toEqual(data);
    });

    it('should throw conflict error if user already exists', async () => {
      const data = {
        email: 'existing@test.com',
        password: 'password123',
        confirmPassword: 'password123',
      };
      mockUsersRepository.findOneBy.mockResolvedValue(data);

      await expect(service.register(data)).rejects.toThrow(
        'No se pudo completar el registro. Por favor, verifica tus datos.',
      );
    });
  });

  describe('resetPassword', () => {
    it('should generate reset token and send email', async () => {
      const email = 'test@test.com';
      const user = { email, resetCode: null, resetCodeExpiration: null };
      mockUsersRepository.findOne.mockResolvedValue(user);
      mockUsersRepository.save.mockImplementation((user) => {
        user.resetCode = '123456';
        user.resetCode = dayjs().add(10, 'minutes').toDate();
        return user;
      });

      const result = await service.resetPassword(email);
      expect(result.token).toBeDefined();
      expect(result.pinCode).toBeDefined();
      expect(mockUsersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          resetCode: result.pinCode,
        }),
      );
    });

    it('should throw not found error if user does not exist', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);

      await expect(
        service.resetPassword('nonexistent@test.com'),
      ).rejects.toThrow('El usuario con este correo no existe');
    });
  });

  describe('changePassword', () => {
    it('should update the password successfully', async () => {
      const body: ChangePasswordDto = {
        pinCode: '123456',
        newPassword: 'newPassword123',
        confirmNewPassword: 'newPassword123',
      };

      const reqUser = { email: 'test@test.com' } as User;
      const tenMinutesForwardDate = dayjs().add(10, 'minutes').toDate();
      const user = {
        email: reqUser.email,
        resetCode: '123456',
        resetCodeExpiration: tenMinutesForwardDate,
      };
      mockUsersRepository.findOne.mockResolvedValue(user);

      const result = await service.changePassword(body, reqUser);
      expect(result.success).toBe(true);
      expect(mockUsersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          password: body.newPassword,
          resetCode: null,
          resetCodeExpiration: null,
        }),
      );
    });

    it('should throw not found error if user or pin code is invalid', async () => {
      const body: ChangePasswordDto = {
        pinCode: 'invalid',
        newPassword: 'newPassword123',
        confirmNewPassword: 'newPassword123',
      };
      const reqUser = { email: 'test@test.com' } as User;
      mockUsersRepository.findOne.mockResolvedValue(null);

      await expect(service.changePassword(body, reqUser)).rejects.toThrow(
        'Usuario no encontrado',
      );
    });
  });
});
