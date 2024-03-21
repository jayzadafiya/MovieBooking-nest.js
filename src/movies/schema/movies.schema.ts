import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Theater } from 'src/theater/schema/theater.schema';

@Schema()
export class Movie extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop([String])
  genre: string[];

  @Prop()
  duration: number;

  @Prop()
  release_date: Date;

  @Prop()
  rating: number;

  @Prop()
  photo: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Theater' }] })
  theater: Theater[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
