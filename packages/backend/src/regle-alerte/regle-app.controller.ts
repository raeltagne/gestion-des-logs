import { Controller ,UseGuards,Post,Get,HttpCode,HttpStatus,Body,Param,HttpException} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RegleAppService } from './regle-app.service';
import { CreateRegleAppDto } from './dto/create-regleApp.dto';

@Controller('regle-app')
export class RegleAppController {
    constructor(private readonly regleAppService: RegleAppService) {}
        
          @Post()
          @UseGuards(JwtAuthGuard)
          @HttpCode(HttpStatus.ACCEPTED)
          create(@Body() createRegleAppDto: CreateRegleAppDto) {
            return this.regleAppService.create(createRegleAppDto);
          }

          @Post("update/:id")
          @UseGuards(JwtAuthGuard)
          @HttpCode(HttpStatus.ACCEPTED)
        async update(@Body() createRegleAppDto: CreateRegleAppDto, @Param('id') id: string) {
          try {
            return await this.regleAppService.update(createRegleAppDto, id);
          } catch (error) {
            // Gérer les erreurs ici
            throw new HttpException('Erreur lors de la mise à jour', HttpStatus.INTERNAL_SERVER_ERROR);
          }
        }
        
          @Get()
          @UseGuards(JwtAuthGuard)
          findAll() {
            return this.regleAppService.findAll();
          }
}
