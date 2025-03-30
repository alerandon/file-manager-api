import { Test, TestingModule } from '@nestjs/testing';
import { TUploadFileToS3Input } from '../../src/modules/s3/s3.dto';
import { S3Service } from '../../src/modules/s3/s3.service';

describe('S3Service', () => {
  let service: S3Service;

  const bucketName = 'test-bucket';
  const region = 'us-east-1';
  const mockS3 = { send: jest.fn() };

  beforeAll(() => {
    process.env.AWS_S3_BUCKET_NAME = bucketName;
    process.env.AWS_REGION = region;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3Service,
        {
          provide: 'S3',
          useValue: mockS3,
        },
      ],
    }).compile();

    service = module.get<S3Service>(S3Service);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFileToS3', () => {
    it('should upload a file and return the upload link', async () => {
      const fileNameKey = 'test-file.txt';
      const fileBuffer = Buffer.from('test file content');

      mockS3.send.mockResolvedValueOnce({});

      const resultParam = {
        fileNameKey,
        fileBuffer,
      } as TUploadFileToS3Input;
      const result = await service.uploadFileToS3(resultParam);

      expect(result).toBe(
        `https://${bucketName}.s3.${region}.amazonaws.com/${fileNameKey}`,
      );
      expect(mockS3.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            Bucket: bucketName,
            Key: fileNameKey,
            Body: fileBuffer,
            ACL: 'public-read',
          }),
        }),
      );
    });

    it('should throw an error if upload fails', async () => {
      const fileNameKey = 'test-file.txt';
      const fileBuffer = Buffer.from('test file content');
      const uploadFileParams = {
        fileNameKey,
        fileBuffer,
      } as TUploadFileToS3Input;

      mockS3.send.mockRejectedValueOnce(new Error('Upload failed'));

      await expect(service.uploadFileToS3(uploadFileParams)).rejects.toThrow(
        'Upload failed',
      );
    });
  });
});
