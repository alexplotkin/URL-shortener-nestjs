import { ApiProperty } from '@nestjs/swagger';

export class ShortenResponse {
  @ApiProperty({
    description: 'Shorten url to our server',
    example: 'http://localhost:4000/shorten/:code',
  })
  url: string;
}
