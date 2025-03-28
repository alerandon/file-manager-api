import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from '../../src/modules/files/file.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { File } from '../../src/modules/files/file.entity';
import { Repository } from 'typeorm';

describe('FilesService', () => {
  let service: FilesService;
  let repository: Repository<File>;

  const mockFileRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: getRepositoryToken(File),
          useValue: mockFileRepository,
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
    repository = module.get<Repository<File>>(getRepositoryToken(File));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all files', async () => {
    const files = [
      { id: '1', name: 'File1', uploadLink: 'http://example.com' },
    ];
    mockFileRepository.find.mockResolvedValue(files);

    const result = await service.findAll();
    expect(result).toEqual(files);
    expect(mockFileRepository.find).toHaveBeenCalled();
  });

  it('should return a file by id', async () => {
    const file = { id: '1', name: 'File1', uploadLink: 'http://example.com' };
    mockFileRepository.findOne.mockResolvedValue(file);

    const result = await service.findOne('1');
    expect(result).toEqual(file);
    expect(mockFileRepository.findOne).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });

  it('should create a new file', async () => {
    const file = { name: 'File1', uploadLink: 'http://example.com' };
    const savedFile = { id: '1', ...file };
    mockFileRepository.create.mockReturnValue(file);
    mockFileRepository.save.mockResolvedValue(savedFile);

    const result = await service.create(file);
    expect(result).toEqual(savedFile);
    expect(mockFileRepository.create).toHaveBeenCalledWith(file);
    expect(mockFileRepository.save).toHaveBeenCalledWith(file);
  });

  it('should update a file', async () => {
    const file = {
      id: '1',
      name: 'UpdatedFile',
      uploadLink: 'http://example.com',
    };
    mockFileRepository.findOne.mockResolvedValue(file);
    mockFileRepository.update.mockResolvedValue(undefined);

    const result = await service.update('1', { name: 'UpdatedFile' });
    expect(result).toEqual(file);
    expect(mockFileRepository.findOne).toHaveBeenCalledWith({
      where: { id: '1' },
    });
    expect(mockFileRepository.update).toHaveBeenCalledWith('1', {
      name: 'UpdatedFile',
    });
  });

  it('should delete a file', async () => {
    const file = { id: '1', name: 'File1', uploadLink: 'http://example.com' };
    mockFileRepository.findOne.mockResolvedValue(file);
    mockFileRepository.delete.mockResolvedValue(undefined);

    await service.remove('1');
    expect(mockFileRepository.findOne).toHaveBeenCalledWith({
      where: { id: '1' },
    });
    expect(mockFileRepository.delete).toHaveBeenCalledWith('1');
  });

  it('should throw an error if file to delete is not found', async () => {
    mockFileRepository.findOne.mockResolvedValue(null);

    await expect(service.remove('1')).rejects.toThrow('File not found');
    expect(mockFileRepository.findOne).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });
});
