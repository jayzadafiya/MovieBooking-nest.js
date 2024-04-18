import { IsMongoId, IsNumber, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class TimeslotDto {
  @IsMongoId()
  _id: mongoose.Types.ObjectId;

  @IsNumber()
  price: number;
}

export class AddMovieDto {
  timeslots: TimeslotDto[];

  @IsOptional()
  @IsMongoId()
  ownerId?: string;

  @IsOptional()
  isdone: string;
}
