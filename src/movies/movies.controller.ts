import {
  Body,
  Controller,
  Param,
  Post,
  Get,
  Patch,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Movie } from './schema/movies.schema';
import { UpdateMovieDto } from './dto/update-moive.dto';
import { RolesGuard } from 'src/role/role.gurd';
import { Roles } from 'src/role/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../utils/file-upload-utill';
import { Role } from 'src/utils/role.enum';

@Controller('movie')
export class MoviesController {
  constructor(private movieService: MoviesService) {}

  @Get('/')
  async getAllMoives(): Promise<Movie[]> {
    return this.movieService.getAllMoive();
  }

  @Get('/:id')
  async getMovieById(@Param('id') id: string) {
    return this.movieService.getMovieById(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post('/')
  async createMovie(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.movieService.createMovie(createMovieDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Patch('/:id')
  async updateMovie(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<Movie> {
    return this.movieService.updateMoive(id, updateMovieDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Delete('/:id')
  async deleteMoive(@Param('id') id: string): Promise<void> {
    this.movieService.deleteMovie(id);
  }

  @Get(':id/theaters')
  async showMovieTheater(@Param('id') movieId: string): Promise<string[]> {
    return this.movieService.showMovieTheater(movieId);
  }

  @Patch(':id/photo')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async addPhoto(
    @Param('id') movieId: string,
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<Movie> {
    return this.movieService.addMoviePhoto(movieId, file.filename);
  }
}
