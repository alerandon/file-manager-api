import { Module } from '@nestjs/common';
import { S3 } from '@aws-sdk/client-s3';

@Module({
  providers: [
    {
      provide: 'S3',
      useFactory: () => {
        return new S3({
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
          },
          region: process.env.AWS_REGION!,
        });
      },
    },
  ],
  exports: ['S3'],
})
export class S3Module {}
