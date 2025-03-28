import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { S3Service } from '../s3/s3.service';
import { TPhotoResponse } from './images.dto';

@Injectable()
export class ImagesService {
  constructor(
    @Inject('PEXELS')
    private readonly config: { apiKey: string; baseUrl: string },
    private readonly s3Service: S3Service,
  ) {}

  async searchImages(query: string, page: number = 1, perPage: number = 10) {
    const response = await axios.get(`${this.config.baseUrl}/search`, {
      params: { query, page, per_page: perPage },
      headers: { Authorization: this.config.apiKey },
    });
    return response.data;
  }

  async getImageById(id: string): Promise<TPhotoResponse> {
    const response = await axios.get(`${this.config.baseUrl}/photos/${id}`, {
      headers: { Authorization: this.config.apiKey },
    });
    return response.data;
  }

  async uploadImageToS3(imageId: string) {
    const imageDetails = await this.getImageById(imageId);
    const imageUrl = imageDetails.src.original;

    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data);

    const uploadResult = await this.s3Service.uploadFileToS3({
      fileNameKey: imageId,
      fileType: 'image/jpeg',
      fileBuffer: imageBuffer,
    });

    return uploadResult;
  }
}
