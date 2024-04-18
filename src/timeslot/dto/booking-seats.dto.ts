import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';

import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class DateValidator implements PipeTransform {
  transform(value: any): number {
    // console.log('value', value);
    const dateParts = value.bookingDate.split('/');
    console.log(dateParts);
    if (dateParts.length !== 3 || dateParts[2].length !== 2) {
      throw new BadRequestException(
        'Invalid date format. Please provide date in the format dd/mm/yy',
      );
    }
    const [day, month, year] = dateParts.map(Number);
    const providedDate = new Date(year, month - 1, day);

    const currentDate = new Date();
    console.log(currentDate, providedDate);

    if (providedDate < currentDate) {
      throw new BadRequestException('Please enter a valid future date');
    }
    console.log('date', dateParts);

    return parseInt(dateParts[0]);
  }
}
export class SeatDto {
  @IsMongoId()
  _id: mongoose.Types.ObjectId;
}

export class BookingSeatsDto {
  @IsNotEmpty()
  @IsString()
  bookingDate: string;

  seats: SeatDto[];
}
