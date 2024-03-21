import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Theater } from './schema/theater.schema';
import mongoose, { Types } from 'mongoose';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { MoviesService } from 'src/movies/movies.service';
import { TimeslotService } from 'src/timeslot/timeslot.service';
import { AddMovieDto } from './dto/add-movie.dto';

@Injectable()
export class TheaterService {
  constructor(
    @InjectModel(Theater.name) private TheaterModel: mongoose.Model<Theater>,
    private moviesService: MoviesService,
    private timeslotService: TimeslotService,
  ) {}

  async getTheater(id: string): Promise<Theater> {
    return await this.TheaterModel.findById(id);
  }

  async createTheater(createTheaterDto: CreateTheaterDto): Promise<Theater> {
    const theater = await this.TheaterModel.create(createTheaterDto);

    return theater;
  }

  async addMovie(
    theaterId: string,
    movieId: string,
    addMoveDto: AddMovieDto,
  ): Promise<Theater> {
    if (
      !Types.ObjectId.isValid(theaterId) ||
      !Types.ObjectId.isValid(movieId)
    ) {
      throw new BadRequestException('Invalid theater or movie ID');
    }

    const theater =
      await this.TheaterModel.findById(theaterId).populate('timeslots');
    const movie = await this.moviesService.getMovieById(movieId);

    if (!theater || !movie) {
      throw new Error('Theater or movie not found');
    }

    //timeslot validation
    const timeslotIds: Types.ObjectId[] = theater.timeslots.map((timeslot) =>
      timeslot._id.toString(),
    );

    addMoveDto.timeslots.forEach((timeslot) => {
      if (timeslotIds.includes(timeslot._id)) {
        const { _id, price } = timeslot;
        this.timeslotService.updateTimeslot(_id.toString(), price, movie._id.toString());
      } else {
        throw new Error(
          `timeslot with this id ${timeslot._id} is not present into this theater`,
        );
      }
    });

    theater.movies.push(movie);
    movie.theater.push(theater);

    await theater.save();
    await movie.save();

    return theater;
  }

  async getMoviForTheater(id: string): Promise<string[]> {
    const { movies } = await this.TheaterModel.findById(id)
      .populate('movies')
      .select('movies');

    console.log(movies);

    const movieName = movies.map((movie) => movie.title);

    return movieName;
  }
}
