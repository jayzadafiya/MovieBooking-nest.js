import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Movie } from './schema/movies.schema';
import mongoose from 'mongoose';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-moive.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private MovieModel: mongoose.Model<Movie>,
  ) {}

  async getAllMoive(): Promise<Movie[]> {
    return await this.MovieModel.find().exec();
  }

  async createMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = await this.MovieModel.create(createMovieDto);

    return movie;
  }

  async getMovieById(id: string): Promise<Movie> {
    const movie = await this.MovieModel.findById(id).exec();

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return movie;
  }

  async updateMoive(
    id: string,
    updateMoiveDto: UpdateMovieDto,
  ): Promise<Movie> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new NotAcceptableException('Invalid ID');
    }
    const movie = await this.MovieModel.findByIdAndUpdate(id, updateMoiveDto, {
      new: true,
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return movie;
  }

  async deleteMovie(id: string): Promise<void> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new NotAcceptableException('Invalid ID');
    }

    const movie = await this.MovieModel.deleteOne({ _id: id });
    console.log(movie);
    if (movie.deletedCount === 0) {
      throw new NotFoundException('Movie not found');
    }
  }

  async showMovieTheater(id: string): Promise<string[]> {
    const theaters = await this.MovieModel.findById(id)
      .populate('theater', 'name')
      .select('theater');
    const theaterNames = theaters.theater.map((theater) => theater.name);
    return theaterNames;
  }

  async addMoviePhoto(id: string, image: string): Promise<Movie> {
    return await this.MovieModel.findByIdAndUpdate(
      id,
      { photo: image },
      { new: true },
    );
  }
}
