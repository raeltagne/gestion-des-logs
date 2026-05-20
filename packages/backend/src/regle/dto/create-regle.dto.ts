import { IsString, IsNotEmpty, IsOptional, IsObject} from 'class-validator';

export class CreateRegleDto {
  @IsString()
  @IsNotEmpty()
  level: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsObject()
  @IsOptional()
  meta?: Record<string, any>;
} 