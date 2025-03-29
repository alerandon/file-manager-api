import { Express } from 'express';
import { Readable } from 'stream';
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
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './file.service';
import { File } from './file.entity';
import { User } from '../users/user.entity';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  @UseGuards(AuthGuard('auth-jwt'))
  findByCurrentUser(@Req() req) {
    const reqUser = req.user as User;
    return this.filesService.findByCurrentUser(reqUser);
  }

  @Get(':id')
  @UseGuards(AuthGuard('auth-jwt'))
  findById(@Param('id') id: string, @Req() req) {
    const reqUser = req.user as User;
    return this.filesService.findById(id, reqUser);
  }

  @Put('rename/:id')
  @UseGuards(AuthGuard('auth-jwt'))
  async renameFile(
    @Param('id') id: string,
    @Body('newName') newName: string,
    @Req() req,
  ): Promise<File> {
    const reqUser = req.user as User;
    return this.filesService.renameFile(id, newName, reqUser);
  }

  @Post('upload')
  @UseGuards(AuthGuard('auth-jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const reqUser = req.user as User;
    const fileParams = {
      fileName: file.originalname,
      fileType: file.mimetype,
      fileBuffer: file.buffer,
    };

    const response = this.filesService.uploadFile(fileParams, reqUser);
    return response;
  }

  @Get('download/:key')
  @UseGuards(AuthGuard('auth-jwt'))
  async downloadFile(
    @Param('key') key: string,
    @Req() req,
    @Res() res,
  ): Promise<void> {
    const reqUser = req.user as User;
    const response = await this.filesService.downloadFile(key, reqUser);
    const readableData = response.data as Readable;

    res.setHeader('Content-Type', response.headers['content-type']);
    res.setHeader('Content-Disposition', `attachment; filename="${key}"`);
    readableData.pipe(res);
  }
}
