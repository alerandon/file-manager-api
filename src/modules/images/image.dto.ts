import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class SearchImagesDto {
  @ApiPropertyOptional({
    description: 'Search query for images',
    example: 'mountains',
  })
  @IsString()
  @IsNotEmpty()
  query: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: '1',
  })
  @IsString()
  @IsOptional()
  page?: string;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: '10',
  })
  @IsString()
  @IsOptional()
  perPage?: string;
}

export type TPhotoResponse = {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  src: {
    original: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
};

export type TSearchResponse = {
  total_results: number;
  page: number;
  per_page: number;
  photos: TPhotoResponse[];
};
