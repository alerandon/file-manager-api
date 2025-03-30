import { Express } from 'express';
import { Readable } from 'stream';
import * as NestCommon from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './file.service';
import { File } from './file.entity';
import { User } from '../users/user.entity';
import { FindByCurrentUserDocs } from './docs/find-by-current-user';
import { FindByIdDocs } from './docs/find-by-id';
import { RenameFileDocs } from './docs/rename-file';
import { UploadFileDocs } from './docs/upload-file';
import { DownloadFileDocs } from './docs/download-file';

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
  findById(@NestCommon.Param('id') id: string, @NestCommon.Req() req) {
    const reqUser = req.user as User;
    return this.filesService.findById(id, reqUser);
  }

  @NestCommon.Put('rename/:id')
  @NestCommon.UseGuards(AuthGuard('auth-jwt'))
  @Swagger.ApiOperation(RenameFileDocs.apiOperation)
  @Swagger.ApiParam(RenameFileDocs.apiParam)
  @Swagger.ApiBody(RenameFileDocs.apiBody)
  @Swagger.ApiResponse(RenameFileDocs.apiResponseStatus200)
  @Swagger.ApiResponse(RenameFileDocs.apiResponseStatus404)
  async renameFile(
    @NestCommon.Param('id') id: string,
    @NestCommon.Body('newName') newName: string,
    @NestCommon.Req() req,
  ): Promise<File> {
    const reqUser = req.user as User;
    return this.filesService.renameFile(id, newName, reqUser);
  }

  @NestCommon.Post('upload')
  @NestCommon.UseGuards(AuthGuard('auth-jwt'))
  @NestCommon.UseInterceptors(FileInterceptor('file'))
  @Swagger.ApiOperation(UploadFileDocs.apiOperation)
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

    const response = this.filesService.uploadFile(fileParams, reqUser);
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
