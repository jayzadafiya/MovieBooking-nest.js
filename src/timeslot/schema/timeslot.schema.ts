import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Movie } from 'src/movies/schema/movies.schema';
import { Theater } from 'src/theater/schema/theater.schema';
// import { Screen } from 'src/screen/schema/screen.schema';

@Schema()
export class Seat {
  @Prop({ default: new mongoose.Types.ObjectId() })
  _id: mongoose.Types.ObjectId;

  @Prop({ default: false })
  isBooked: boolean;

  @Prop({ type: [{ type: Number }] })
  bookingDates: number[];
}

@Schema()
export class Timeslot extends Document {
  @Prop()
  start: string;

  @Prop()
  end: string;

  @Prop()
  screenNumber: number;

  @Prop()
  price: number;

  @Prop({ type: [[Seat]], required: true })
  seats: Seat[][];

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Movie' })
  movie: Movie;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Theater' })
  theater: Theater;
}

export const TimeslotSchema = SchemaFactory.createForClass(Timeslot);
