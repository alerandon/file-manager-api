import * as Swagger from '@nestjs/swagger';
import * as NestCommon from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ImagesService } from './image.service';
import { SearchImagesDto } from './image.dto';
import { User } from '../users/user.entity';

@Swagger.ApiTags('Images')
@NestCommon.Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @NestCommon.Get('search')
  @NestCommon.UseGuards(AuthGuard('auth-jwt'))
  @Swagger.ApiOperation({ summary: 'Search images' })
  @Swagger.ApiQuery({
    name: 'query',
    description: 'Search query for images',
    required: false,
  })
  @Swagger.ApiResponse({
    status: 200,
    description: 'Images retrieved successfully.',
  })
  @Swagger.ApiResponse({ status: 401, description: 'Unauthorized access.' })
  async searchImages(@NestCommon.Query() searchImagesDto: SearchImagesDto) {
    const imagesList = await this.imagesService.searchImages(searchImagesDto);
    const response = { data: { ...imagesList } };
    return response;
  }

  @NestCommon.Get(':id')
  @NestCommon.UseGuards(AuthGuard('auth-jwt'))
  @Swagger.ApiOperation({ summary: 'Get image by ID' })
  @Swagger.ApiParam({ name: 'id', description: 'ID of the image to retrieve' })
  @Swagger.ApiResponse({
    status: 200,
    description: 'Image retrieved successfully.',
  })
  @Swagger.ApiResponse({ status: 404, description: 'Image not found.' })
  async getImageById(@NestCommon.Param('id') id: string) {
    const image = await this.imagesService.getImageById(id);
    const response = { data: { ...image } };
    return response;
  }

  @NestCommon.Post('upload/:id')
  @NestCommon.UseGuards(AuthGuard('auth-jwt'))
  @Swagger.ApiOperation({ summary: 'Upload an image to S3' })
  @Swagger.ApiParam({ name: 'id', description: 'ID of the image to upload' })
  @Swagger.ApiResponse({
    status: 201,
    description: 'Image uploaded successfully.',
  })
  @Swagger.ApiResponse({ status: 400, description: 'Invalid upload request.' })
  async uploadImageToS3(
    @NestCommon.Param('id') id: string,
    @NestCommon.Req() req,
  ) {
    const reqUser = req.user as User;
    const { uploadLink, file } = await this.imagesService.uploadImageToS3(
      id,
      reqUser,
    );
    const response = { data: { uploadLink, file } };
    return response;
  }
}
