import { ApiProperty } from '@nestjs/swagger';

export class StatShortcodeResponse {
  @ApiProperty({ description: 'Shortcode value' })
  shortcode: string;

  @ApiProperty({ description: 'Original url. It is where shortcode redirect' })
  url: string;

  @ApiProperty({ description: 'How many times users user this shortcode' })
  hitScore: number;
}
