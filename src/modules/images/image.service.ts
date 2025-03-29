import axios from 'axios';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { SearchImagesDto, TPhotoResponse, TSearchResponse } from './image.dto';
import { S3Service } from '../s3/s3.service';
import { User } from '../users/user.entity';
import { File } from '../files/file.entity';

@Injectable()
export class ImagesService {
  constructor(
    @Inject('PEXELS')
    private readonly config: { apiKey: string; baseUrl: string },
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly s3Service: S3Service,
  ) {}

  async searchImages(body: SearchImagesDto): Promise<TSearchResponse> {
    const response = await axios.get(`${this.config.baseUrl}/search`, {
      params: {
        query: body.query,
        page: body.page,
        per_page: body.perPage,
      },
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

  async uploadImageToS3(imageId: string, reqUser: User) {
    const imageDetails = await this.getImageById(imageId);
    const imageUrl = imageDetails.src.original;
    const imageResponse = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });
    const imageBuffer = Buffer.from(imageResponse.data);

    const imageName = `pexels-photo-${imageId}.jpeg`;
    const imageKey = `${reqUser.email}--${imageName}`;

    const uploadLinkParams = {
      fileNameKey: imageKey,
      fileType: 'image/jpeg',
      fileBuffer: imageBuffer,
    };
    const uploadLink = await this.s3Service.uploadFileToS3(uploadLinkParams);

    let file = await this.fileRepository.findOne({
      where: {
        name: imageKey,
        user: { id: reqUser.id },
      },
      relations: ['user'],
    });
    console.log('file: ', file);
    if (!file) {
      const newFileParams = {
        name: imageName,
        uploadLink,
        user: reqUser,
      };
      file = this.fileRepository.create(newFileParams);
      await this.fileRepository.save(file);
    }

    const response = { uploadLink, file };
    return response;
  }
}
