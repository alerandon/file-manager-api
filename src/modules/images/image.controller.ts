import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ImagesService } from './image.service';
import { SearchImagesDto } from './image.dto';
import { User } from '../users/user.entity';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get('search')
  @UseGuards(AuthGuard('auth-jwt'))
  async searchImages(@Query() searchImagesDto: SearchImagesDto) {
    const imagesList = await this.imagesService.searchImages(searchImagesDto);
    const response = { data: { ...imagesList } };
    return response;
  }

  @Get(':id')
  @UseGuards(AuthGuard('auth-jwt'))
  async getImageById(@Param('id') id: string) {
    const image = await this.imagesService.getImageById(id);
    const response = { data: { ...image } };
    return response;
  }

  @Post('upload/:id')
  @UseGuards(AuthGuard('auth-jwt'))
  async uploadImageToS3(@Param('id') id: string, @Req() req) {
    const reqUser = req.user as User;
    const { uploadLink, file } = await this.imagesService.uploadImageToS3(
      id,
      reqUser,
    );
    const response = { data: { uploadLink, file } };
    return response;
  }
}
