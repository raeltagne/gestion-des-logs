import { IsString, IsNotEmpty, IsOptional, IsObject} from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsObject()
  @IsOptional()
  meta?: Record<string, any>;
} 