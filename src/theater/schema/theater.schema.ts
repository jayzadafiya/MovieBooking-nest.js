import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Screen } from '../../screen/schema/screen.schema';
import { Movie } from 'src/movies/schema/movies.schema';
import { Timeslot } from 'src/timeslot/schema/timeslot.schema';

@Schema()
export class Theater extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  city: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Screen' }] })
  screens: Screen[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Timeslot' }] })
  timeslots: Timeslot[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }] })
  movies: Movie[];
}

export const TheaterSchema = SchemaFactory.createForClass(Theater);
