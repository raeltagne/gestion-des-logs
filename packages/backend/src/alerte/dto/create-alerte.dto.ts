import {  IsNotEmpty, IsOptional, IsObject, IsDateString} from 'class-validator';

export class CreateAlerteDto {
 
  @IsDateString()
  @IsNotEmpty()
  dateAlerte:Date;
  
  @IsObject()
  @IsOptional()
  meta?: Record<string, any>;

  constructor(date:Date){
    this.dateAlerte=date;
  }
} 