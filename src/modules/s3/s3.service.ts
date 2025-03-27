import { Injectable, Inject } from '@nestjs/common';
import { S3, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

@Injectable()
export class S3Service {
  constructor(@Inject('S3') private readonly s3: S3) {}

  async uploadFile(fileBuffer: Buffer, fileName: string): Promise<string> {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: fileBuffer,
    });

    await this.s3.send(command);

    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  }

  async downloadFile(key: string): Promise<Buffer> {
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
