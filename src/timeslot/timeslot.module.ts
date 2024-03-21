import { Module } from '@nestjs/common';
import { TimeslotController } from './timeslot.controller';
import { TimeslotService } from './timeslot.service';
import { TimeslotSchema } from './schema/timeslot.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TheaterSchema } from 'src/theater/schema/theater.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Timeslot', schema: TimeslotSchema },
      { name: 'Theater', schema: TheaterSchema },
    ]),
  ],
  controllers: [TimeslotController],
  providers: [TimeslotService],
  exports: [TimeslotService],
})
export class TimeslotModule {}
