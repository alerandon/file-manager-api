import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ImagesService {
  constructor(
    @Inject('PEXELS')
    private readonly config: { apiKey: string; baseUrl: string },
  ) {}

  async searchImages(query: string, page: number = 1, perPage: number = 10) {
    const response = await axios.get(`${this.config.baseUrl}/search`, {
      params: { query, page, per_page: perPage },
      headers: { Authorization: this.config.apiKey },
    });
    return response.data;
  }

  async getImageById(id: string) {
    const response = await axios.get(`${this.config.baseUrl}/photos/${id}`, {
      headers: { Authorization: this.config.apiKey },
    });
    return response.data;
  }
}
