import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesService } from './image.service';
import { ImagesController } from './image.controller';
import { File } from '../files/file.entity';
import { S3Module } from '../s3/s3.module';
import { S3Service } from '../s3/s3.service';

@Module({
  imports: [ConfigModule, S3Module, TypeOrmModule.forFeature([File])],
  controllers: [ImagesController],
  providers: [
    ImagesService,
    S3Service,
    {
      provide: 'PEXELS',
      useFactory: () => ({
        apiKey: process.env.PEXELS_API_KEY,
        baseUrl: process.env.PEXELS_API_URL,
      }),
    },
  ],
  exports: [ImagesService],
})
export class ImagesModule {}
