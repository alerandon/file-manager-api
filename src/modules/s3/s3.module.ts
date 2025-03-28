import { Module } from '@nestjs/common';
import { S3 } from '@aws-sdk/client-s3';
import { S3Service } from './s3.service';

@Module({
  providers: [
    S3Service,
    {
      provide: 'S3',
      useFactory: () => {
        const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } =
          process.env;

        return new S3({
          credentials: {
            accessKeyId: AWS_ACCESS_KEY_ID!,
            secretAccessKey: AWS_SECRET_ACCESS_KEY!,
          },
          region: AWS_REGION,
        });
      },
    },
  ],
  exports: ['S3'],
})
export class S3Module {}
