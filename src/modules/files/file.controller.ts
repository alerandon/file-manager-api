import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './file.service';
import { File } from './file.entity';
import { Express } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get(':email')
  findByUserEmail(@Param('email') email: string) {
    return this.filesService.findByUserEmail(email);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.group('File Upload');
    console.trace();
    console.log('file: ', file);
    console.groupEnd();

    const response = this.filesService.uploadFile({
      fileName: file.originalname,
      fileType: file.mimetype,
      fileBuffer: file.buffer,
    });
    return response;
  }

  @Get('download/:key')
  async downloadFile(@Param('key') key: string, @Res() res): Promise<void> {
    const fileBuffer = await this.filesService.downloadFile(key);
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${key}"`,
    });
    res.send(fileBuffer);
  }

  @Put('rename/:id')
  async renameFile(
    @Param('id') id: string,
    @Body('newName') newName: string,
  ): Promise<File> {
    return this.filesService.renameFile(id, newName);
  }
}
