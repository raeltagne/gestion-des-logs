import { Controller,Body,HttpCode,HttpStatus,Post,Get,UseGuards } from '@nestjs/common';
import { AlerteService } from './alerte.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('alerte')
export class AlerteController {
    constructor(private readonly alerteService: AlerteService) {}
    
      @Get()
      @UseGuards(JwtAuthGuard)
      findAll() {
        return this.alerteService.findAll();
      }
    
}
