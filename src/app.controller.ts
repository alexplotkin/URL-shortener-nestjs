import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiOkResponse({ type: String })
  @Get()
  getHello(): string {
    return 'Server is working';
  }
}
