import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { File } from './file.entity';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from '../s3/s3.service';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [TypeOrmModule.forFeature([File]), ConfigModule.forRoot(), S3Module],
  controllers: [FilesController],
  providers: [FilesService, S3Service],
  exports: [FilesService],
})
export class FilesModule {}
