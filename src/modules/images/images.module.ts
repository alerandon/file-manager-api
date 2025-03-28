import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';

@Module({
  imports: [ConfigModule],
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
