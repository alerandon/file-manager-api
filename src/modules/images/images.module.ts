import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { S3Module } from '../s3/s3.module'; // Importamos el módulo de S3

@Module({
  imports: [ConfigModule, S3Module], // Añadimos S3Module a las importaciones
  providers: [
    ImagesService,
    {
      provide: 'PEXELS',
      useFactory: () => ({
        apiKey: process.env.PEXELS_API_KEY,
        baseUrl: process.env.PEXELS_API_URL,
      }),
    },
  ],
  controllers: [ImagesController],
})
export class ImagesModule {}
