import { IsNumber, IsString } from 'class-validator';

export class CreateTimeslotDto {
  @IsString()
  start: string;

  @IsString()
  end: string;

  @IsNumber()
  screenNumber: number;

}
