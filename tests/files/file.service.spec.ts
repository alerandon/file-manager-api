import axios from 'axios';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { File } from '../../src/modules/files/file.entity';
import { User } from '../../src/modules/users/user.entity';
import { S3Module } from '../../src/modules/s3/s3.module';
import { S3Service } from '../../src/modules/s3/s3.service';
import { FilesService } from '../../src/modules/files/file.service';

describe('FilesService', () => {
  let service: FilesService;

  const mockFileRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockS3Service = {
    uploadFileToS3: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [S3Module],
      providers: [
        FilesService,
        {
          provide: getRepositoryToken(File),
          useValue: mockFileRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: S3Service,
          useValue: mockS3Service,
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByCurrentUser', () => {
    it('should return files for the current user', async () => {
      const reqUser = { email: 'test@test.com' } as User;
      const files = [{ id: '1', name: 'File1', user: reqUser }] as File[];
      mockFileRepository.find.mockResolvedValue(files);

      const result = await service.findByCurrentUser(reqUser);
      expect(result).toEqual(files);
      expect(mockFileRepository.find).toHaveBeenCalledWith({
        where: { user: { email: reqUser.email } },
      });
    });
  });

  describe('findById', () => {
    it('should return a file by id for the current user', async () => {
      const reqUser = { email: 'test@test.com' } as User;
      const file = { id: '1', name: 'File1', user: reqUser } as File;
      mockFileRepository.findOne.mockResolvedValue(file);

      const result = await service.findById('1', reqUser);
      expect(result).toEqual(file);
      expect(mockFileRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1', user: { email: reqUser.email } },
        relations: ['user'],
      });
    });

    it('should throw NotFoundException if file is not found', async () => {
      const reqUser = { email: 'test@test.com' } as User;
      mockFileRepository.findOne.mockResolvedValue(null);

      await expect(service.findById('1', reqUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('renameFile', () => {
    it('should rename a file', async () => {
      const reqUser = { email: 'test@test.com' } as User;
      const file = { id: '1', name: 'OldName', user: reqUser } as File;
      mockFileRepository.findOne.mockResolvedValue(file);
      mockFileRepository.save.mockResolvedValue({ ...file, name: 'NewName' });

      const result = await service.renameFile('1', 'NewName', reqUser);
      expect(result.name).toBe('NewName');
      expect(mockFileRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1', user: { email: reqUser.email } },
      });
      expect(mockFileRepository.save).toHaveBeenCalledWith({
        ...file,
        name: 'NewName',
      });
    });

    it('should throw an error if file is not found', async () => {
      const reqUser = { email: 'test@test.com' } as User;
      mockFileRepository.findOne.mockResolvedValue(null);

      await expect(service.renameFile('1', 'NewName', reqUser)).rejects.toThrow(
        'File not found',
      );
    });
  });

  describe('uploadFile', () => {
    it('should upload a file and return it', async () => {
      const reqUser = { email: 'test@test.com' } as User;
      const body = {
        fileName: 'File1',
        fileType: 'text/plain',
        fileBuffer: Buffer.from(''),
      };
      const uploadLink = 'http://example.com/upload';
      mockS3Service.uploadFileToS3.mockResolvedValue(uploadLink);
      mockFileRepository.findOne.mockResolvedValue(null);
      mockFileRepository.create.mockImplementation((file) => file);
      mockFileRepository.save.mockResolvedValue({
        name: body.fileName,
        uploadLink,
        user: reqUser,
      });

      const result = await service.uploadFile(body, reqUser);
      expect(result).toEqual({
        name: body.fileName,
        uploadLink,
        user: reqUser,
      });
      expect(mockS3Service.uploadFileToS3).toHaveBeenCalledWith({
        fileNameKey: `${reqUser.email}--${body.fileName}`,
        fileType: body.fileType,
        fileBuffer: body.fileBuffer,
      });
    });
  });

  describe('downloadFile', () => {
    it('should download a file', async () => {
      const reqUser = { email: 'test@test.com' } as User;
      const file = {
        name: 'File1',
        uploadLink: 'http://example.com/download',
        user: reqUser,
      } as File;
      mockFileRepository.findOne.mockResolvedValue(file);

      const axiosGetMock = jest
        .spyOn(axios, 'get')
        .mockResolvedValue({ data: 'file-content' });
      const result = await service.downloadFile('File1', reqUser);

      expect(result).toEqual({ data: 'file-content' });
      expect(mockFileRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'File1', user: { email: reqUser.email } },
      });
      expect(axiosGetMock).toHaveBeenCalledWith(file.uploadLink, {
        responseType: 'stream',
      });
    });

    it('should throw NotFoundException if file is not found', async () => {
      const reqUser = { email: 'test@test.com' } as User;
      mockFileRepository.findOne.mockResolvedValue(null);

      await expect(service.downloadFile('File1', reqUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
