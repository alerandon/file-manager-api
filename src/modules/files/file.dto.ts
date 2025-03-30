import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RenameFileDto {
  @ApiProperty({
    description: 'New name to rename the file',
    example: 'new-file.txt',
    format: 'string',
  })
  @IsString()
  @IsNotEmpty()
  newName: string;
}

export type TUploadFileInput = {
  fileName: string;
  fileType: string;
  fileBuffer: Buffer;
};
