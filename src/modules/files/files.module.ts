import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { File } from './file.entity';
import { ConfigModule } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    ConfigModule.forRoot(), // Para cargar las variables de entorno
  ],
  controllers: [FilesController],
  providers: [
    FilesService,
    {
      provide: 'S3',
      useFactory: () => {
        return new S3({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION,
        });
      },
    },
  ],
  exports: [FilesService],
})
export class FilesModule {}
