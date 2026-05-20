import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyStrategy } from './strategies/api-key.strategy';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [JwtModule.register({
      secret: 'secretKey',
      signOptions:{expiresIn: '1h'},
    }),
    ElasticsearchModule.register({
      node:'http://localhost:9200',
    }),
    PassportModule],
    controllers:[AuthController],
  providers: [AuthService, ApiKeyStrategy,LocalStrategy,JwtStrategy],
  exports: [AuthService],
})

export class AuthModule {}
