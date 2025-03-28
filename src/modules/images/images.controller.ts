import { Controller, Get, Query, Param } from '@nestjs/common';
import { ImagesService } from './images.service';
import { SearchImagesDto } from './images.dto';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get('search')
  async searchImages(@Query() searchImagesDto: SearchImagesDto) {
    const { query, page, perPage } = searchImagesDto;
    const imagesList = await this.imagesService.searchImages(
      query,
      page,
      perPage,
    );
    const response = { data: { ...imagesList } };
    return response;
  }

  @Get(':id')
  async getImageById(@Param('id') id: string) {
    const image = await this.imagesService.getImageById(id);
    const response = { data: { ...image } };
    return response;
  }

  @Get('upload/:id')
  async uploadImageToS3(@Param('id') id: string) {
    const uploadLink = await this.imagesService.uploadImageToS3(id);
    const response = { data: { uploadLink } };
    return response;
  }
}
