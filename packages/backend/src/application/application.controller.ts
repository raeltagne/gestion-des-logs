import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Query } from '@nestjs/common';
import { ApplicationsService } from './application.service';
import { CreateApplicationDto } from './dto/create-Application.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';


@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  create(@Body() createLogDto: CreateApplicationDto) {
    return this.applicationsService.create(createLogDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.applicationsService.findAll();
  }

}