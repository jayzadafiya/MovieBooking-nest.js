import { Module } from '@nestjs/common';
import { ScreenController } from './screen.controller';
import { ScreenService } from './screen.service';
import { ScreenSchema } from './schema/screen.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TheaterModule } from 'src/theater/theater.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Screen', schema: ScreenSchema }]),
    TheaterModule,
  ],
  controllers: [ScreenController],
  providers: [ScreenService],
  exports: [ScreenService],
})
export class ScreenModule {}
