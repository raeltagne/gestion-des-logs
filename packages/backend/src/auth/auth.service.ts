import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService:JwtService,
    private readonly elasticsearchService:ElasticsearchService,
    private readonly configService:ConfigService){}

  private readonly validApiKey = this.configService.get<string>('AUTH_API_KEY');

  validateApiKey(apiKey: string): boolean {
    return apiKey === this.validApiKey;
  };

  generateJwt(user:any){
    return this.jwtService.sign(user);
  }
  async validateUser({username,password}:LoginDto){
    const query={
      query:{
        match:{
          username:{
            query:username,
          },
        },
      },
      _source:['username','password','role'],
    };

    const response=await this.elasticsearchService.search({
      index:'users-*',
      body:query,
    //  _source:['name','surname','username','password','timestamp','role'],
    });

   
    if(response){
      const data=response.hits.hits[0];
      const pwd=(data._source as any)['password'];
      const isValid=await bcrypt.compare(password,pwd);
      if(isValid){
        const source=data._source;
        const{password,...user}=source as any;
        user['id']=data._id;
        //user['token']=this.jwtService.sign(user);
        return user;
      }
    }
    return null;
  }
}

