import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TheaterService } from './theater.service';
import { Theater } from './schema/theater.schema';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { AddMovieDto } from './dto/add-movie.dto';
import { RolesGuard } from 'src/role/role.gurd';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/utils/role.enum';
import { AuthService } from 'src/auth/auth.service';

@Controller('theater')
export class TheaterController {
  constructor(
    private theaterService: TheaterService,
    private userService: AuthService,
  ) {}

  private async validateAdminOwnership(
    dtoData: CreateTheaterDto | AddMovieDto,
  ): Promise<string> {
    const { ownerId } = dtoData;
    if (!ownerId) {
      throw new BadRequestException('Please provide Owner Id');
    }

    const owner = await this.userService.getUserById(ownerId);
    if (!owner || owner.role !== Role.Owner) {
      throw new BadRequestException('Please provide a valid Owner Id');
    }

    return ownerId;
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Owner)
  @Post('/')
  async createTheater(
    @Body() createTheaterDto: CreateTheaterDto,
    @Request() req,
  ): Promise<Theater> {
    let ownerId = null;
    if (req.user.role === 'admin') {
      ownerId = await this.validateAdminOwnership(createTheaterDto);
    }
    if (req.user.role === 'owner') {
      console.log(req.user);
      ownerId = req.user.userId;
    }

    return this.theaterService.createTheater(createTheaterDto, ownerId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Owner)
  @Post(':theaterId/movie/:movieId')
  async addMovie(
    @Param() params: { theaterId: string; movieId: string },
    @Body() addMovieDto: AddMovieDto,
    @Request() req,
  ): Promise<Theater> {
    let ownerId = null;
    if (req.user.role === 'admin') {
      ownerId = await this.validateAdminOwnership(addMovieDto);
    }
    if (req.user.role === 'owner') {
      console.log(req.user);
      ownerId = req.user.userId;
    }
    return await this.theaterService.addMovie(
      params.theaterId,
      params.movieId,
      addMovieDto,
      ownerId,
    );
  }

  @Get(':theaterId/movies')
  async getMoviForTheater(
    @Param('theaterId') theaterId: string,
  ): Promise<string[]> {
    return await this.theaterService.getMoviForTheater(theaterId);
  }
}
