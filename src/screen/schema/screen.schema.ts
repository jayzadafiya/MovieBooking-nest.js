import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Theater } from '../../theater/schema/theater.schema';
// import { Section } from 'src/section/schema/section.schema';

@Schema()
export class Screen extends Document {
  @Prop()
  screenName: string;

  @Prop()
  screenNumber: number;



  @Prop()
  seatingCapacity: number;

  @Prop()
  numOfColomun: number;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Theater' })
  theater: Theater;

  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }] })
  // sections: Section[];
}

export const ScreenSchema = SchemaFactory.createForClass(Screen);
