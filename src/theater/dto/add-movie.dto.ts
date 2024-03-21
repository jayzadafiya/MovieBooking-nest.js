import { IsMongoId, IsNumber } from 'class-validator';
import mongoose from 'mongoose';

export class TimeslotDto {
  @IsMongoId()
  _id: mongoose.Types.ObjectId;

  @IsNumber()
  price: number;
}

export class AddMovieDto {
  timeslots: TimeslotDto[];
}
