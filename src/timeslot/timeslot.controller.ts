import {
  Controller,
  Post,
  Param,
  Body,
  Get,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TimeslotService } from './timeslot.service';
import { CreateTimeslotDto } from './dto/create-timeslot.dto';
import { Timeslot } from './schema/timeslot.schema';
import { BookingSeatsDto } from './dto/booking-seats.dto';
import { RolesGuard } from 'src/role/role.gurd';
import { Roles } from 'src/role/role.decorator';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/schema/user.schema';
import {
  OptionalDto,
  UpdateTimeslotDto,
} from './dto/update-timeslot-details.dto';
import { Role } from 'src/utils/role.enum';

@Controller('timeslot')
export class TimeslotController {
  constructor(private timeslotService: TimeslotService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Owner)
  @Post('/theater/:theaterId')
  async createTimeslot(
    @Param('theaterId') theaterId: string,
    @Body() createTimeslotdto: CreateTimeslotDto,
  ): Promise<Timeslot> {
    return await this.timeslotService.createTimeslot(
      theaterId,
      createTimeslotdto,
    );
  }

  @Get('/theater/:theaterId/movie/:movieId')
  async getAvailableTimeslots(
    @Param('theaterId') theaterId: string,
    @Param('movieId') movieId: string,
  ): Promise<Timeslot[]> {
    return await this.timeslotService.getAvailableTimeslots(theaterId, movieId);
  }

  @Get('/:id/seats')
  async getAvailableTimeslotsSeats(
    @Param('id') id: string,
    @Body('date') date: string,
  ): Promise<any> {
    return await this.timeslotService.getAvailableTimeslotsSeats(id, date);
  }

  @UseGuards(RolesGuard)
  @Patch('/:timeslotId/seat-booking')
  async bookTicketById(
    @Param('timeslotId') timeslotId: string,
    @Body()
    bookingSeatsDto: BookingSeatsDto,
    @GetUser() user: User,
  ): Promise<string> {
    return await this.timeslotService.bookTicketById(
      timeslotId,
      bookingSeatsDto,
      user,
    );
  }

  @Patch('/:timeslotId/addMovie')
  async updateTimeslot(
    @Param('timeslotId') timeslotId: string,
    @Body() updateTimeslotDto: UpdateTimeslotDto,
    @Query() optinalDto: OptionalDto,
  ) {
    const { price, movieId } = updateTimeslotDto;
    return await this.timeslotService.updateTimeslot(
      timeslotId,
      price,
      movieId,
      optinalDto,
    );
  }
}
