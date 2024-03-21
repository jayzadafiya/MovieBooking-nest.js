import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Timeslot } from './schema/timeslot.schema';
import mongoose from 'mongoose';
import { CreateTimeslotDto } from './dto/create-timeslot.dto';
import * as moment from 'moment';
import { Theater } from 'src/theater/schema/theater.schema';
import { BookingSeatsDto } from './dto/booking-seats.dto';
import Stripe from 'stripe';
import { User } from 'src/auth/schema/user.schema';
import { OptionalDto } from './dto/update-timeslot-details.dto';

@Injectable()
export class TimeslotService {
  private stripe;

  constructor(
    @InjectModel(Timeslot.name) private TimeslotModel: mongoose.Model<Timeslot>,
    @InjectModel(Theater.name) private TheaterModel: mongoose.Model<Theater>,
  ) {
    this.stripe = new Stripe(
      'sk_test_51OpTdCSAo3xRMIJ7V2pLo8Xcio8k2LPnfwP9vcBTUqCBiGO73be6g8ZQlARf4Ko0oIiUZ9wKZcQXSDqY3sPu0yIe00TPRS1E3o',
      {
        apiVersion: '2023-10-16',
      },
    );
  }

  convertTo12HourFormat(time: string): string {
    return moment(time, 'HH:mm:ss').format('h:mm:ss A');
  }

  async createTimeslot(
    theaterId: string,
    createTimeslotDto: CreateTimeslotDto,
  ): Promise<Timeslot> {
    const startTime = this.convertTo12HourFormat(createTimeslotDto.start);
    const endTime = this.convertTo12HourFormat(createTimeslotDto.end);

    const theater =
      await this.TheaterModel.findById(theaterId).populate('screens');

    const screen = theater.screens.find(
      (screen) => screen.screenNumber === createTimeslotDto.screenNumber,
    );

    const totalSeat = screen.seatingCapacity;
    const col = screen.numOfColomun;
    const row = Math.ceil(totalSeat / col);

    const seats = Array.from({ length: row }, () =>
      Array.from({ length: col }, () => ({
        _id: new mongoose.Types.ObjectId(),
      })),
    );

    const timeslotData = {
      ...createTimeslotDto,
      start: startTime,
      end: endTime,
      seats,
      theater,
    };
    const timeslot = await this.TimeslotModel.create(timeslotData);
    theater.timeslots.push(timeslot);
    await theater.save();

    return timeslot;
  }

  async updateTimeslot(
    id: string,
    price: number,
    movieId: string,
    optionalDto?: OptionalDto,
  ): Promise<Timeslot> {
    const update: any = { price, movie: movieId };

    if (optionalDto && optionalDto.start && optionalDto.end) {
      update.start = this.convertTo12HourFormat(optionalDto.start);
      update.end = this.convertTo12HourFormat(optionalDto.end);
    }

    const timeslot = await this.TimeslotModel.findByIdAndUpdate(id, update, {
      new: true,
    });
    timeslot.seats.forEach((seats) =>
      seats.forEach((seat) => (seat.bookingDates = [])),
    );

    timeslot.save();

    return timeslot;
  }

  async getAvailableTimeslots(
    theaterId: string,
    movieId: string,
  ): Promise<Timeslot[]> {
    const currentTime = moment().format('hh:mm:ss A');
    console.log(currentTime);
    const timeslots = await this.TimeslotModel.find({
      theater: new mongoose.Types.ObjectId(theaterId),
      movie: new mongoose.Types.ObjectId(movieId),
      start: { $gte: currentTime },
    }).select('-theater -movie -seats -__v');

    return timeslots;
  }

  async getAvailableTimeslotsSeats(id: string, date: string) {
    const searchDate = parseInt(date.split('-')[0]);
    const timeslot = await this.TimeslotModel.findById(id).select('seats');
    if (!timeslot) {
      throw new BadRequestException('Timeslot not found');
    }
    const availableSeats = [];

    for (const seatRow of timeslot.seats) {
      const availableInRow = [];

      for (const seat of seatRow) {
        if (!seat.bookingDates.includes(searchDate)) {
          availableInRow.push(seat._id);
        }
      }

      if (availableInRow.length > 0) {
        availableSeats.push(availableInRow);
      }
    }

    return availableSeats;
  }

  async bookTicketById(
    timeslotId: string,
    bookingSeatsDto: BookingSeatsDto,
    user: User,
  ): Promise<string> {
    const { seats, bookingDate } = bookingSeatsDto;

    let amount = 0;

    const timeslot =
      await this.TimeslotModel.findById(timeslotId).select('+seats +price');

    // for (const bookingSeat of seats) {
    //   for (const seatRow of timeslot.seats) {
    //     for (const seat of seatRow) {
    //       if (seat._id.equals(bookingSeat._id)) {
    //         // seat.isBooked = true;
    //         if (seat.bookingDates.includes(parseInt(bookingDate))) {
    //           throw new ConflictException('This seat is already book');
    //         } else {
    //           seat.bookingDates.push(parseInt(bookingDate));
    //           amount += timeslot.price;
    //         }
    //       }
    //     }
    //   }
    // }

    const seatMap = {};
    for (const seatRow of timeslot.seats) {
      for (const seat of seatRow) {
        seatMap[seat._id.toString()] = seat;
      }
    }

    let allBookingSeatsFound = true;
    for (const bookingSeat of seats) {
      const seat = seatMap[bookingSeat._id.toString()];
      if (!seat) {
        allBookingSeatsFound = false;
        break;
      }
    }

    if (!allBookingSeatsFound) {
      throw new NotFoundException('One or more booking seats not found');
    }

    for (const bookingSeat of seats) {
      const seat = seatMap[bookingSeat._id.toString()];
      if (seat.bookingDates.includes(bookingDate)) {
        throw new ConflictException('This seat is already booked');
      } else {
        seat.bookingDates.push(bookingDate);
        amount += timeslot.price;
      }
    }

    if (amount !== 0) {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `http://192.168.2.110:3000/`,
        cancel_url: `http://192.168.2.110:3000/`,
        customer_email: user.email,
        client_reference_id: timeslotId,
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'movie booking ',
                description: `you are try to book ${bookingSeatsDto.seats.length}seats`,
              },
              unit_amount: amount * bookingSeatsDto.seats.length * 100,
            },
            quantity: bookingSeatsDto.seats.length,
          },
        ],
      });
      console.log(session);
    }

    timeslot.save();
    return `you have to pay ${amount}`;
  }

  async updateMovieAndShowtimeing() {}
}
