import { IsString, IsNotEmpty, IsOptional, IsObject} from 'class-validator';

export class CreateRegleAppDto {
  @IsString()
  @IsNotEmpty()
  regle: string;

  @IsString()
  @IsNotEmpty()
  application: string;

  @IsString()
  etat: string;

  @IsObject()
  @IsOptional()
  meta?: Record<string, any>;
} 