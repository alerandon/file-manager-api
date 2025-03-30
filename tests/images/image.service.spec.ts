import axios from 'axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../src/modules/users/user.entity';
import { File } from '../../src/modules/files/file.entity';
import { S3Service } from '../../src/modules/s3/s3.service';
import { ImagesService } from '../../src/modules/images/image.service';

describe('ImagesService', () => {
  let service: ImagesService;

  const mockApiKey = 'mock-api-key';
  const mockBaseUrl = 'mock-base-url';
  const mockFileRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockS3Service = {
    uploadFileToS3: jest.fn(),
  };
  const mockPexelsConfig = {
    apiKey: mockApiKey,
    baseUrl: mockBaseUrl,
  };

  beforeAll(() => {
    process.env.PEXELS_API_KEY = mockApiKey;
    process.env.PEXELS_API_URL = mockBaseUrl;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImagesService,
        {
          provide: 'PEXELS',
          useValue: mockPexelsConfig,
        },
        {
          provide: getRepositoryToken(File),
          useValue: mockFileRepository,
        },
        {
          provide: S3Service,
          useValue: mockS3Service,
        },
      ],
    }).compile();

    service = module.get<ImagesService>(ImagesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchImages', () => {
    it('should return search results from Pexels API', async () => {
      const mockResponse = { data: { photos: [], total_results: 0 } };
      jest.spyOn(axios, 'get').mockResolvedValue(mockResponse);

      const result = await service.searchImages({
        query: 'nature',
        page: '1',
        perPage: '10',
      });

      expect(result).toEqual(mockResponse.data);
      expect(axios.get).toHaveBeenCalledWith(
        `${mockPexelsConfig.baseUrl}/search`,
        {
          params: { query: 'nature', page: '1', per_page: '10' },
          headers: { Authorization: mockPexelsConfig.apiKey },
        },
      );
    });
  });

  describe('getImageById', () => {
    it('should return image details from Pexels API', async () => {
      const mockResponse = { data: { id: '123', src: { original: 'url' } } };
      jest.spyOn(axios, 'get').mockResolvedValue(mockResponse);

      const result = await service.getImageById('123');
      expect(result).toEqual(mockResponse.data);
      expect(axios.get).toHaveBeenCalledWith(
        `${mockPexelsConfig.baseUrl}/photos/123`,
        { headers: { Authorization: mockPexelsConfig.apiKey } },
      );
    });
  });

  describe('uploadImageToS3', () => {
    it('should upload an image to S3 and save it in the database', async () => {
      const reqUser = { email: 'test@test.com' } as User;
      const mockImageDetails = {
        src: { original: 'https://example.com/image.jpg' },
      };
      const mockImageBuffer = Buffer.from('image-data');
      const mockUploadLink =
        'https://mock-upload-link.com/test-bucket/image.jpg';

      jest
        .spyOn(axios, 'get')
        .mockResolvedValueOnce({ data: mockImageDetails })
        .mockResolvedValueOnce({ data: mockImageBuffer });

      mockS3Service.uploadFileToS3.mockResolvedValue(mockUploadLink);
      mockFileRepository.findOne.mockResolvedValue(null);
      mockFileRepository.create.mockImplementation((file) => file);
      mockFileRepository.save.mockResolvedValue({
        name: 'pexels-photo-123.jpeg',
        uploadLink: mockUploadLink,
        user: reqUser,
      });

      const result = await service.uploadImageToS3('123', reqUser);

      expect(result).toEqual({
        uploadLink: mockUploadLink,
        file: {
          name: 'pexels-photo-123.jpeg',
          uploadLink: mockUploadLink,
          user: reqUser,
        },
      });
      expect(mockS3Service.uploadFileToS3).toHaveBeenCalledWith({
        fileNameKey: `${reqUser.email}--pexels-photo-123.jpeg`,
        fileType: 'image/jpeg',
        fileBuffer: mockImageBuffer,
      });
      expect(mockFileRepository.save).toHaveBeenCalled();
    });
  });
});
