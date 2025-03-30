import { Express } from 'express';
import { Readable } from 'stream';
import * as NestCommon from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './file.service';
import { User } from '../users/user.entity';
import { FindByCurrentUserDocs } from './docs/find-by-current-user';
import { FindByIdDocs } from './docs/find-by-id';
import { RenameFileDocs } from './docs/rename-file';
import { UploadFileDocs } from './docs/upload-file';
import { DownloadFileDocs } from './docs/download-file';
import { RenameFileDto } from './file.dto';

@Swagger.ApiTags('Files')
@Swagger.ApiBearerAuth()
@NestCommon.Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @NestCommon.Get()
  @NestCommon.UseGuards(AuthGuard('auth-jwt'))
  @Swagger.ApiOperation(FindByCurrentUserDocs.apiOperation)
  @Swagger.ApiResponse(FindByCurrentUserDocs.apiResponseStatus200)
  @Swagger.ApiResponse(FindByCurrentUserDocs.apiResponseStatus401)
  async findByCurrentUser(@NestCommon.Req() req) {
    const reqUser = req.user as User;
    const files = await this.filesService.findByCurrentUser(reqUser);
    const response = { data: files };
    return response;
  }

  @NestCommon.Get(':id')
  @NestCommon.UseGuards(AuthGuard('auth-jwt'))
  @Swagger.ApiOperation(FindByIdDocs.apiOperation)
  @Swagger.ApiParam(FindByIdDocs.apiParam)
  @Swagger.ApiResponse(FindByIdDocs.apiResponseStatus200)
  @Swagger.ApiResponse(FindByIdDocs.apiResponseStatus404)
  async findById(@NestCommon.Param('id') id: string, @NestCommon.Req() req) {
    const reqUser = req.user as User;
    const file = await this.filesService.findById(id, reqUser);
    const response = { data: file };
    return response;
  }

  @NestCommon.Put('rename/:id')
  @NestCommon.UseGuards(AuthGuard('auth-jwt'))
  @Swagger.ApiOperation(RenameFileDocs.apiOperation)
  @Swagger.ApiParam(RenameFileDocs.apiParam)
  @Swagger.ApiResponse(RenameFileDocs.apiResponseStatus200)
  @Swagger.ApiResponse(RenameFileDocs.apiResponseStatus404)
  async renameFile(
    @NestCommon.Param('id') id: string,
    @NestCommon.Body() renameFileDto: RenameFileDto,
    @NestCommon.Req() req,
  ) {
    const reqUser = req.user as User;
    const renamedFile = await this.filesService.renameFile(
      id,
      renameFileDto.newName,
      reqUser,
    );
    const response = { data: renamedFile };
    return response;
  }

  @NestCommon.Post('upload')
  @NestCommon.UseGuards(AuthGuard('auth-jwt'))
  @NestCommon.UseInterceptors(FileInterceptor('file'))
  @Swagger.ApiOperation(UploadFileDocs.apiOperation)
  @Swagger.ApiConsumes('multipart/form-data')
  @Swagger.ApiBody(UploadFileDocs.apiBody)
  @Swagger.ApiResponse(UploadFileDocs.apiResponseStatus201)
  @Swagger.ApiResponse(UploadFileDocs.apiResponseStatus400)
  async uploadFile(
    @NestCommon.UploadedFile() file: Express.Multer.File,
    @NestCommon.Req() req,
  ) {
    const reqUser = req.user as User;
    const fileParams = {
      fileName: file.originalname,
      fileType: file.mimetype,
      fileBuffer: file.buffer,
    };
    const uploadedFile = await this.filesService.uploadFile(
      fileParams,
      reqUser,
    );
    const response = { data: uploadedFile };
    return response;
  }

  @NestCommon.Get('download/:key')
  @NestCommon.UseGuards(AuthGuard('auth-jwt'))
  @Swagger.ApiOperation(DownloadFileDocs.apiOperation)
  @Swagger.ApiParam(DownloadFileDocs.apiParam)
  @Swagger.ApiResponse(DownloadFileDocs.apiResponseStatus200)
  @Swagger.ApiResponse(DownloadFileDocs.apiResponseStatus404)
  async downloadFile(
    @NestCommon.Param('key') key: string,
    @NestCommon.Req() req,
    @NestCommon.Res() res,
  ): Promise<void> {
    const reqUser = req.user as User;
    const response = await this.filesService.downloadFile(key, reqUser);
    const readableData = response.data as Readable;

    res.setHeader('Content-Type', response.headers['content-type']);
    res.setHeader('Content-Disposition', `attachment; filename="${key}"`);
    readableData.pipe(res);
  }
}
