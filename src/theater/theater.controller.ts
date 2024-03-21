import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TheaterService } from './theater.service';
import { Theater } from './schema/theater.schema';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { AddMovieDto } from './dto/add-movie.dto';
import { RolesGuard } from 'src/role/role.gurd';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/utils/role.enum';

@Controller('theater')
export class TheaterController {
  constructor(private theaterService: TheaterService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Owner)
  @Post('/')
  async createTheater(
    @Body() createTheaterDto: CreateTheaterDto,
  ): Promise<Theater> {
    return this.theaterService.createTheater(createTheaterDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Owner)
  @Post(':theaterId/movie/:movieId')
  async addMovie(
    @Param() params: { theaterId: string; movieId: string },
    @Body() addMovieDto: AddMovieDto,
  ): Promise<Theater> {
    return await this.theaterService.addMovie(
      params.theaterId,
      params.movieId,
      addMovieDto,
    );
  }

  @Get(':theaterId/movies')
  async getMoviForTheater(
    @Param('theaterId') theaterId: string,
  ): Promise<string[]> {
    return await this.theaterService.getMoviForTheater(theaterId);
  }
}
