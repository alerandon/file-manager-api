import { Readable } from 'stream';
import { Injectable, Inject } from '@nestjs/common';
import { S3, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { TUploadFileToS3Input } from './s3.dto';

@Injectable()
export class S3Service {
  constructor(@Inject('S3') private readonly s3: S3) {}

  async uploadFileToS3(body: TUploadFileToS3Input) {
    const { AWS_S3_BUCKET_NAME } = process.env;
    const command = new PutObjectCommand({
      Bucket: AWS_S3_BUCKET_NAME,
      Key: body.fileName,
      Body: body.fileBuffer,
      ACL: 'public-read',
    });

    const response = await this.s3.send(command);
    return response;
  }

  async downloadFileFromS3(key: string): Promise<Buffer> {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const response = await this.s3.send(command);

    const stream = response.Body as Readable;
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      const bufferChunk = Buffer.from(chunk);
      chunks.push(bufferChunk);
    }

    return Buffer.concat(chunks);
  }
}
