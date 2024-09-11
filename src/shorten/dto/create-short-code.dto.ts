import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, Matches } from 'class-validator';

export class CreateShortCodeDTO {
  @ApiProperty({
    description: 'Long URL, that we want to replace with shorter one',
    example:
      'https://example.com/very-long-url-path?with=query&parameters=true',
  })
  @IsString()
  @IsUrl({}, { message: 'url must be in format of url' })
  @Matches(/^(http|https):\/\//, {
    message: 'url must be absolute, including http/https start',
  })
  url: string;
}
