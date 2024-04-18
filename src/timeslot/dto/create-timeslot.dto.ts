import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class CreateTimeslotDto {
  @IsString()
  start: string;

  @IsNotEmpty()
  @IsString()
  end: string;

  @IsNumber()
  screenNumber: number;
}
