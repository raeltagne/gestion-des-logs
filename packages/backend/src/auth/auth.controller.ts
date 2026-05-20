import { Controller,Post,Body, HttpException,UseGuards, Get, Req } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { LocalGuard } from "./guards/local.guard";
import { Request } from "express";
import { JwtAuthGuard } from "./guards/jwt.guard";


@Controller('auth')
export class AuthController{

    constructor(private authService:AuthService){}
    @Post('login')
    @UseGuards(LocalGuard)
    login( @Req() req:Request){
        const user=req.user;
        const token=this.authService.generateJwt(user);
        console.log(token);
        return {
            token,
            user,
        };
    }

    @Get('status')
    @UseGuards(JwtAuthGuard)
    status(@Req() req:Request){
        return req.user;
    }
}