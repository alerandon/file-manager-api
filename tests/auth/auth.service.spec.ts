import * as dayjs from 'dayjs';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../../src/modules/users/user.entity';
import { AuthService } from '../../src/modules/auth/auth.service';
import { ChangePasswordDto } from 'src/modules/auth/auth.dto';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersRepository = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn((user) => Promise.resolve(user)),
  };
  const mockResendInstance = {
    emails: {
      send: jest.fn().mockResolvedValue({ id: 'mock-email-id' }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '3h' },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: 'UserRepository',
          useValue: mockUsersRepository,
        },
        {
          provide: 'Resend',
          useValue: mockResendInstance,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateGoogleLogin', () => {
    it('should create a new user if not exists', async () => {
      const reqUser = { email: 'google@test.com', provider: 'google' } as User;
      mockUsersRepository.findOne.mockResolvedValue(null);
      mockUsersRepository.create.mockImplementation((user) => user);
      mockUsersRepository.save.mockResolvedValue(reqUser);

      const result = await service.validateGoogleLogin(reqUser);
      expect(result).toEqual(
        expect.objectContaining({
          token: expect.any(String),
          user: expect.objectContaining({
            email: reqUser.email,
            provider: reqUser.provider,
          }),
        }),
      );
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
      mockUsersRepository.create.mockImplementation((user) => user);
      mockUsersRepository.save.mockResolvedValue(data);

      const result = await service.register(data);
      expect(result).toEqual(
        expect.objectContaining({
          token: expect.any(String),
          user: expect.objectContaining({
            email: data.email,
            password: data.password,
          }),
        }),
      );
    });

    it('should throw conflict error if user already exists', async () => {
      const data = {
        email: 'existing@test.com',
        password: 'password123',
        confirmPassword: 'password123',
      };
      mockUsersRepository.findOneBy.mockResolvedValue(data);

      await expect(service.register(data)).rejects.toThrow(
        'The registration could not be completed. Please verify your data.',
      );
    });
  });

  describe('resetPassword', () => {
    it('should generate reset token and send email', async () => {
      const email = 'test@test.com';
      const user = { email, resetCode: null, resetCodeExpiration: null };

      mockUsersRepository.findOne.mockResolvedValue(user);
      mockUsersRepository.save.mockResolvedValue(user);

      const result = await service.resetPassword(email);
      expect(result.token).toBeDefined();
      expect(result.pinCode).toBeDefined();
      expect(mockUsersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: user.email,
          resetCode: result.pinCode,
          resetCodeExpiration: expect.any(Date),
        }),
      );
      expect(mockResendInstance.emails.send).toHaveBeenCalledWith({
        from: 'no-reply@resend.dev',
        to: email,
        subject: 'Verification Code to Reset Password',
        html: expect.stringContaining(result.pinCode),
      });
    });

    it('should throw not found error if user does not exist', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);

      await expect(
        service.resetPassword('nonexistent@test.com'),
      ).rejects.toThrow('The user with this email does not exist');
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
      mockUsersRepository.save.mockImplementation((userToSave) => {
        userToSave.password = body.newPassword;
        userToSave.resetCode = null;
        userToSave.resetCodeExpiration = null;
        return Promise.resolve(userToSave);
      });

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
        'User not found',
      );
    });
  });
});
