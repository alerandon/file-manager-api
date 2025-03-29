import axios from 'axios';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './file.entity';
import { S3Service } from '../s3/s3.service';
import { User } from '../users/user.entity';
import { TUploadFileInput } from './file.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly s3Service: S3Service,
  ) {}

  async findByCurrentUser(reqUser: User) {
    const userFiles = await this.fileRepository.find({
      where: { user: { email: reqUser.email } },
      relations: ['user'],
    });

    const response = { data: userFiles };
    return response;
  }

  async findById(id: string, reqUser: User) {
    const file = await this.fileRepository.findOne({
      where: { id, user: { email: reqUser.email } },
      relations: ['user'],
    });
    if (!file) throw new NotFoundException('File not found');

    const response = { data: file };
    return response;
  }

  async renameFile(id: string, newName: string, reqUser: User): Promise<File> {
    const file = await this.fileRepository.findOne({
      where: { id, user: { email: reqUser.email } },
      relations: ['user'],
    });
    if (!file) throw new Error('File not found');

    file.name = newName;
    return this.fileRepository.save(file);
  }

  async uploadFile(body: TUploadFileInput, reqUser: User) {
    const fileNameKey = `${reqUser.email}-${body.fileName}`;
    const uploadLink = await this.s3Service.uploadFileToS3({
      fileNameKey,
      fileType: body.fileType,
      fileBuffer: body.fileBuffer,
    });

    let file = await this.fileRepository.findOne({
      where: {
        name: body.fileName,
        user: { email: reqUser.email },
      },
      relations: ['user'],
    });
    if (!file) {
      const newFileParams = {
        name: body.fileName,
        uploadLink,
        user: reqUser,
      };
      file = this.fileRepository.create(newFileParams);
      await this.fileRepository.save(file);
    }

    const response = { data: file };
    return response;
  }

  async downloadFile(key: string, reqUser: User) {
    const file = await this.fileRepository.findOne({
      where: { name: key, user: { email: reqUser.email } },
      relations: ['user'],
    });
    if (!file) throw new NotFoundException('File not found');

    const downloadedFile = await axios.get(file.uploadLink, {
      responseType: 'stream',
    });
    return downloadedFile;
  }
}
