import { IsString, IsNotEmpty, IsOptional, IsObject,IsDate, IsDateString} from 'class-validator';

export class CreateLogDto {
  @IsString()
  @IsNotEmpty()
  level: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  application: string;

  @IsString()
  @IsNotEmpty()
  source: string;

  //@IsTimeZone()
  @IsDateString()
  @IsNotEmpty()
  timestamp:Date;
  
  @IsObject()
  @IsOptional()
  meta?: Record<string, any>;
} 