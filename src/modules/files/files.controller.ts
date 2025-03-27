import { Controller, Get, Post, Put, Delete, Param, Body, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { File } from './file.entity';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  findAll(): Promise<File[]> {
    return this.filesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<File | null> {
    return this.filesService.findOne(id);
  }

  @Post()
  create(@Body() file: Partial<File>): Promise<File> {
    return this.filesService.create(file);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() file: Partial<File>): Promise<File> {
    return this.filesService.update(id, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.filesService.remove(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<File> {
    return this.filesService.uploadFile(file.buffer, file.originalname);
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

  @Put(':id/rename')
  async renameFile(@Param('id') id: string, @Body('newName') newName: string): Promise<File> {
    return this.filesService.renameFile(id, newName);
  }
}
