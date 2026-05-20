import { Controller,Get,Post,UseGuards,HttpCode,HttpStatus,Body } from '@nestjs/common';
import { RegleService } from './regle.service';
import { CreateRegleDto } from './dto/create-regle.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('regle')
export class RegleController {
      constructor(private readonly regleService: RegleService) {}
    
      @Post()
      @UseGuards(JwtAuthGuard)
      @HttpCode(HttpStatus.ACCEPTED)
      create(@Body() createRegleDto: CreateRegleDto) {
        return this.regleService.create(createRegleDto);
      }
    
      @Get()
      @UseGuards(JwtAuthGuard)
      findAll() {
        return this.regleService.findAll();
      }
    
}
