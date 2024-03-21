import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';
import { TheaterModule } from './theater/theater.module';
import { ScreenModule } from './screen/screen.module';
import { TimeslotModule } from './timeslot/timeslot.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/MovieBooking'),
    JwtModule.register({
      global: true,
      secret: 'okaysomthigngoorjofjdo',
      signOptions: { expiresIn: '15d' },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    MoviesModule,
    TheaterModule,
    ScreenModule,
    TimeslotModule,
  ],
})
export class AppModule {}
