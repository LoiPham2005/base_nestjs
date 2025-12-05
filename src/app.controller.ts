// ============================================
// src/app.controller.ts
// ============================================
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@ApiTags('Health Check')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Root endpoint - API information' })
  @ApiResponse({ status: 200, description: 'Returns API information' })
  getRoot() {
    return this.appService.getApiInfo();
  }

  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Returns health status' })
  async getHealthCheck() {
    return this.appService.getHealthCheck();
  }

  @Public()
  @Get('ping')
  @ApiOperation({ summary: 'Simple ping endpoint' })
  @ApiResponse({ status: 200, description: 'Returns pong' })
  ping() {
    return { message: 'pong', timestamp: new Date().toISOString() };
  }
}