import { Controller, Get, Query, Param } from '@nestjs/common';
import { ImagesService } from './images.service';
import { SearchImagesDto, GetImageByIdDto } from './images.dto';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get('search')
  async searchImages(@Query() searchImagesDto: SearchImagesDto) {
    const { query, page, perPage } = searchImagesDto;
    return this.imagesService.searchImages(query, page, perPage);
  }

  @Get(':id')
  async getImageById(@Param() getImageByIdDto: GetImageByIdDto) {
    return this.imagesService.getImageById(getImageByIdDto.id);
  }
}
