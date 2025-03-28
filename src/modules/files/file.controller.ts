import { Express } from 'express';
import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './file.service';
import { File } from './file.entity';
import { Readable } from 'stream';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('email/:email')
  findByUserEmail(@Param('email') email: string) {
    return this.filesService.findByUserEmail(email);
  }

  @Get('name/:name')
  findByName(@Param('name') name: string) {
    return this.filesService.findByName(name);
  }

  @Put('rename/:id')
  async renameFile(
    @Param('id') id: string,
    @Body('newName') newName: string,
  ): Promise<File> {
    return this.filesService.renameFile(id, newName);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const response = this.filesService.uploadFile({
      fileName: file.originalname,
      fileType: file.mimetype,
      fileBuffer: file.buffer,
    });
    return response;
  }

  @Get('download/:key')
  async downloadFile(@Param('key') key: string, @Res() res): Promise<void> {
    const response = await this.filesService.downloadFile(key);
    const readableData = response.data as Readable;

    res.setHeader('Content-Type', response.headers['content-type']);
    res.setHeader('Content-Disposition', `attachment; filename="${key}"`);
    readableData.pipe(res);
  }
}
