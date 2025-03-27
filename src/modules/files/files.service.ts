import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './file.entity';
import { S3Service } from '../s3/s3.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly s3Service: S3Service,
  ) {}

  findAll(): Promise<File[]> {
    return this.fileRepository.find();
  }

  findOne(id: string): Promise<File | null> {
    return this.fileRepository.findOne({ where: { id } });
  }

  create(file: Partial<File>): Promise<File> {
    const newFile = this.fileRepository.create(file);
    return this.fileRepository.save(newFile);
  }

  async update(id: string, file: Partial<File>): Promise<File> {
    const fileToUpload = await this.fileRepository.findOne({ where: { id } });
    if (!fileToUpload) throw new Error('File not found');

    await this.fileRepository.update(id, file);
    return fileToUpload;
  }

  async remove(id: string): Promise<void> {
    const fileToRemove = await this.fileRepository.findOne({ where: { id } });
    if (!fileToRemove) throw new Error('File not found');

    await this.fileRepository.delete(id);
  }

  async uploadFile(fileBuffer: Buffer, fileName: string): Promise<File> {
    const key = `${uuidv4()}-${fileName}`;
    const uploadLink = await this.s3Service.uploadFile(fileBuffer, key);

    const newFile = this.fileRepository.create({ name: fileName, uploadLink });
    return this.fileRepository.save(newFile);
  }

  async downloadFile(key: string): Promise<Buffer> {
    return this.s3Service.downloadFile(key);
  }

  async renameFile(id: string, newName: string): Promise<File> {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) throw new Error('File not found');

    file.name = newName;
    return this.fileRepository.save(file);
  }
}
