import { Module } from '@nestjs/common';
import { TheaterController } from './theater.controller';
import { TheaterService } from './theater.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TheaterSchema } from './schema/theater.schema';
import { MoviesModule } from 'src/movies/movies.module';
import { TimeslotModule } from 'src/timeslot/timeslot.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Theater', schema: TheaterSchema }]),
    TimeslotModule,
    MoviesModule,
  ],
  controllers: [TheaterController],
  providers: [TheaterService],
  exports: [TheaterService],
})
export class TheaterModule {}
