import { Express } from 'express';
import { Readable } from 'stream';
import * as NestCommon from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './file.service';
import { File } from './file.entity';
import { User } from '../users/user.entity';

@Swagger.ApiTags('Files')
@NestCommon.Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @NestCommon.Get()
  @NestCommon.UseGuards(AuthGuard('auth-jwt'))
  @Swagger.ApiOperation({ summary: 'Get files of the current user' })
  @Swagger.ApiResponse({
    status: 200,
    description: 'List of files retrieved successfully.',
  })
  @Swagger.ApiResponse({ status: 401, description: 'Unauthorized access.' })
  findByCurrentUser(@NestCommon.Req() req) {
    const reqUser = req.user as User;
    return this.filesService.findByCurrentUser(reqUser);
  }

  @NestCommon.Get(':id')
  @NestCommon.UseGuards(AuthGuard('auth-jwt'))
  @Swagger.ApiOperation({ summary: 'Get file by ID' })
  @Swagger.ApiParam({ name: 'id', description: 'ID of the file to retrieve' })
  @Swagger.ApiResponse({
    status: 200,
    description: 'File retrieved successfully.',
  })
  @Swagger.ApiResponse({ status: 404, description: 'File not found.' })
  findById(@NestCommon.Param('id') id: string, @NestCommon.Req() req) {
    const reqUser = req.user as User;
    return this.filesService.findById(id, reqUser);
  }

  @NestCommon.Put('rename/:id')
  @NestCommon.UseGuards(AuthGuard('auth-jwt'))
  @Swagger.ApiOperation({ summary: 'Rename a file' })
  @Swagger.ApiParam({ name: 'id', description: 'ID of the file to rename' })
  @Swagger.ApiBody({
    schema: { type: 'object', properties: { newName: { type: 'string' } } },
  })
  @Swagger.ApiResponse({
    status: 200,
    description: 'File renamed successfully.',
  })
  @Swagger.ApiResponse({ status: 404, description: 'File not found.' })
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
  @Swagger.ApiOperation({ summary: 'Upload a file' })
  @Swagger.ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @Swagger.ApiResponse({
    status: 201,
    description: 'File uploaded successfully.',
  })
  @Swagger.ApiResponse({
    status: 400,
    description: 'Invalid file upload request.',
  })
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
  @Swagger.ApiOperation({ summary: 'Download a file' })
  @Swagger.ApiParam({ name: 'key', description: 'Key of the file to download' })
  @Swagger.ApiResponse({
    status: 200,
    description: 'File downloaded successfully.',
  })
  @Swagger.ApiResponse({ status: 404, description: 'File not found.' })
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
