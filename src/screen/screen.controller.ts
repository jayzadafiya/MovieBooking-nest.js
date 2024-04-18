import {
  Controller,
  Post,
  Param,
  Body,
  UseGuards,
  ConflictException,
} from '@nestjs/common';
import { ScreenService } from './screen.service';
import { ScreenDto } from './dto/create-screen.dto';
import { Screen } from './schema/screen.schema';
import { TheaterService } from 'src/theater/theater.service';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/utils/role.enum';

import { RolesGuard } from 'src/role/role.gurd';

@UseGuards(RolesGuard)
@Roles(Role.Admin, Role.Owner)
@Controller('screen')
export class ScreenController {
  constructor(
    private screenService: ScreenService,
    private theaterService: TheaterService,
  ) {}

  @Post('/add-screen/:id')
  async createScreen(
    @Param('id') theaterId: string,
    @Body() screenDto: ScreenDto,
  ): Promise<Screen> {
    const theater = await this.theaterService.getTheater(theaterId);
    if (!theater) {
      throw new Error('Theater not found');
    }
    await theater.populate('screens');

    theater.screens.forEach((screen) => {
      console.log(screen.screenName, screenDto.screenNumber);
      if (screen.screenNumber === screenDto.screenNumber) {
        throw new ConflictException(
          'Screen already exist with this same number',
        );
      }
    });

    const screen = await this.screenService.createScreen(screenDto, theaterId);
    theater.screens.push(screen);
    theater.save();

    return screen;
  }
}
