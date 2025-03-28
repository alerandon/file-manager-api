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

  async findByUserEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const userFiles = await this.fileRepository.find({
      where: { user },
      relations: ['user'],
    });

    const response = { data: userFiles };
    return response;
  }

  async findByName(name: string) {
    const file = await this.fileRepository.findOne({ where: { name } });
    if (!file) throw new NotFoundException('File not found');

    const response = { data: file };
    return response;
  }

  async renameFile(id: string, newName: string): Promise<File> {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) throw new Error('File not found');

    file.name = newName;
    return this.fileRepository.save(file);
  }

  async uploadFile(body: TUploadFileInput) {
    const fileNameKey = `${1}-${body.fileName}`;
    const uploadLink = await this.s3Service.uploadFileToS3({
      fileNameKey,
      fileType: body.fileType,
      fileBuffer: body.fileBuffer,
    });

    const newFile = this.fileRepository.create({
      name: body.fileName,
      uploadLink,
    });
    await this.fileRepository.save(newFile);

    const response = { data: newFile };
    return response;
  }

  async downloadFile(key: string) {
    const file = await this.fileRepository.findOne({
      where: { name: key },
    });
    if (!file) throw new NotFoundException('File not found');

    const downloadedFile = await axios.get(file.uploadLink, {
      responseType: 'stream',
    });
    return downloadedFile;
  }
}
