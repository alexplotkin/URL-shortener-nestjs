import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { ShortenService } from './shorten.service';
import { CreateShortCodeDTO } from './dto/create-short-code.dto';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ShortenResponse } from './response/shorten.response';
import { Request, Response } from 'express';
import { StatShortcodeResponse } from './response/stat-shortcode.response';

@ApiTags('Shorten')
@Controller('shorten')
export class ShortenController {
  constructor(private readonly shortenService: ShortenService) {}

  @ApiOperation({ summary: 'Create shorten url' })
  @ApiOkResponse({ type: ShortenResponse })
  @ApiBadRequestResponse({
    description: `
    url must be a string
    url must be in format of url
    url must be absolute, including http/https start
    `,
  })
  @Post()
  async createShortCode(
    @Req() request: Request,
    @Body() { url }: CreateShortCodeDTO,
  ) {
    const shortCode = await this.shortenService.createShortCode(url);
    const fullUrl = `${request.protocol}://${request.get('host')}/shorten/${shortCode}`;
    return { url: fullUrl };
  }

  @ApiOperation({ summary: 'Transform code to original url and redirect user' })
  @ApiNotFoundResponse({
    description: `
    Document was not found
    `,
  })
  @Get('/:code')
  async getRedirectUrlFromCode(
    @Param('code') code: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const originalUrl = await this.shortenService.getOriginalUrl(code);
    response.redirect(originalUrl);
  }

  @ApiOperation({ summary: 'Get statistic for shortcode by it`s value' })
  @ApiOkResponse({ type: StatShortcodeResponse })
  @ApiNotFoundResponse({
    description: `
    Document was not found
    `,
  })
  @Get('/stats/:code')
  getShortcodeStats(@Param('code') code: string) {
    return this.shortenService.getShortcodeStats(code);
  }
}
