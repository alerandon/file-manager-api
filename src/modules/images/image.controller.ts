import * as Swagger from '@nestjs/swagger';
import * as NestCommon from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ImagesService } from './image.service';
import { SearchImagesDto } from './image.dto';
import { User } from '../users/user.entity';
import { SearchImagesDocs } from './docs/search-images';
import { GetImageByIdDocs } from './docs/get-image-by-id';
import { UploadImageToS3Docs } from './docs/upload-image-to-s3';

@Swagger.ApiTags('Images')
@Swagger.ApiBearerAuth()
@NestCommon.Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @NestCommon.Get('search')
  @NestCommon.UseGuards(AuthGuard('auth-jwt'))
  @Swagger.ApiOperation(SearchImagesDocs.apiOperation)
  @Swagger.ApiResponse(SearchImagesDocs.apiResponseStatus200)
  async searchImages(@NestCommon.Query() searchImagesDto: SearchImagesDto) {
    const imagesList = await this.imagesService.searchImages(searchImagesDto);
    const response = { data: imagesList };
    return response;
  }

  @NestCommon.Get(':id')
  @NestCommon.UseGuards(AuthGuard('auth-jwt'))
  @Swagger.ApiOperation(GetImageByIdDocs.apiOperation)
  @Swagger.ApiParam(GetImageByIdDocs.apiParam)
  @Swagger.ApiResponse(GetImageByIdDocs.apiResponseStatus200)
  @Swagger.ApiResponse(GetImageByIdDocs.apiResponseStatus404)
  async getImageById(@NestCommon.Param('id') id: string) {
    const image = await this.imagesService.getImageById(id);
    const response = { data: image };
    return response;
  }

  @NestCommon.Post('upload/:id')
  @NestCommon.UseGuards(AuthGuard('auth-jwt'))
  @Swagger.ApiOperation(UploadImageToS3Docs.apiOperation)
  @Swagger.ApiParam(UploadImageToS3Docs.apiParam)
  @Swagger.ApiResponse(UploadImageToS3Docs.apiResponseStatus201)
  @Swagger.ApiResponse(UploadImageToS3Docs.apiResponseStatus404)
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
