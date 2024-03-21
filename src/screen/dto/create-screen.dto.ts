import { IsString, IsNumber } from 'class-validator';

export class ScreenDto {
  @IsString()
  screenName: string;

  @IsNumber()
  screenNumber: number;

  @IsNumber()
  seatingCapacity: number;

  @IsNumber()
  numOfColomun: number;
  //   @Type(() => SeatAvailabilityDto)
  //   available_tickets: SeatAvailabilityDto[];
}
