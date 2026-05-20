import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-headerapikey';
import { AuthService } from '../auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  constructor(private authService: AuthService) {
    super({ header: 'X-API-KEY', prefix: '' }, false);
  }

  public validate(apiKey: string): boolean {
    const isValid = this.authService.validateApiKey(apiKey);
    if (!isValid) {
      throw new UnauthorizedException();
    }
    return true;
  }
} 