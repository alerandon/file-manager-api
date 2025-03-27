import { Test, TestingModule } from '@nestjs/testing';
import { S3Service } from '../../src/s3/s3.service';
import { S3, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

describe('S3Service', () => {
  let service: S3Service;
  let s3Mock: jest.Mocked<S3>;

  beforeEach(async () => {
    s3Mock = {
      send: jest.fn(),
    } as unknown as jest.Mocked<S3>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3Service,
        {
          provide: 'S3',
          useValue: s3Mock,
        },
      ],
    }).compile();

    service = module.get<S3Service>(S3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should upload a file and return the upload link', async () => {
    const fileBuffer = Buffer.from('test file content');
    const fileName = 'test-file.txt';
    const bucketName = 'test-bucket';
    const region = 'us-east-1';

    process.env.AWS_S3_BUCKET_NAME = bucketName;
    process.env.AWS_REGION = region;

    s3Mock.send.mockResolvedValueOnce({});

    const result = await service.uploadFile(fileBuffer, fileName);

    expect(result).toBe(
      `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`,
    );
    expect(s3Mock.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));
  });

  it('should download a file and return its content as a buffer', async () => {
    const fileKey = 'test-file.txt';
    const bucketName = 'test-bucket';
    const fileContent = Buffer.from('test file content');

    process.env.AWS_S3_BUCKET_NAME = bucketName;

    s3Mock.send.mockResolvedValueOnce({
      Body: Readable.from([fileContent]),
    });

    const result = await service.downloadFile(fileKey);

    expect(result).toEqual(fileContent);
    expect(s3Mock.send).toHaveBeenCalledWith(expect.any(GetObjectCommand));
  });
});
