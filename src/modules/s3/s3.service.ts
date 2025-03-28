import { Injectable, Inject } from '@nestjs/common';
import { S3, PutObjectCommand } from '@aws-sdk/client-s3';
import { TUploadFileToS3Input } from './s3.dto';

@Injectable()
export class S3Service {
  constructor(@Inject('S3') private readonly s3: S3) {}

  async uploadFileToS3(body: TUploadFileToS3Input) {
    const { AWS_S3_BUCKET_NAME, AWS_REGION } = process.env;
    const command = new PutObjectCommand({
      Bucket: AWS_S3_BUCKET_NAME,
      Key: body.fileNameKey,
      Body: body.fileBuffer,
      ACL: 'public-read',
    });
    await this.s3.send(command);

    const response = `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${body.fileNameKey}`;
    return response;
  }
}
