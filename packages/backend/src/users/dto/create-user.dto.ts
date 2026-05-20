import { IsString, IsNotEmpty, IsOptional, IsObject, IsEmail, IsNumber } from 'class-validator';
import { EmailFieldProps } from 'react-admin';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  surname: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  role: string;

   @IsNumber()
  @IsNotEmpty()
  number: string;

  @IsEmail()
  email: EmailFieldProps

  @IsString()
  @IsNotEmpty()
  etat: string;
  
  @IsObject()
  @IsOptional()
  meta?: Record<string, any>;
} 