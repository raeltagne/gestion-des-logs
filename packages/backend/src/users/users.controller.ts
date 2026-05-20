import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Query} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ApiKeyAuthGuard } from 'src/auth/guards/api-key.guard';
//import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(ApiKeyAuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('username') username?: string) {
    return this.usersService.findAll(username);
  }

  /*@UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req){
    return req.user; //injecté par JwtStrategy
  }*/

}
