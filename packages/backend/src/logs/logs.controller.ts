import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Query } from '@nestjs/common';
import { LogsService } from './logs.service';
import { CreateLogDto } from './dto/create-log.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ApiKeyAuthGuard } from 'src/auth/guards/api-key.guard';


@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post()
  @UseGuards(ApiKeyAuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  create(@Body() createLogDto: CreateLogDto) {
    return this.logsService.create(createLogDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('level') level?: string) {
    return this.logsService.findAll(level);
  }

  @Get('applications')
  @UseGuards(JwtAuthGuard)
  findAllApplication() {
    return this.logsService.findAllApplication();
  }
}