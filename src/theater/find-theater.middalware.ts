// find-screen.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TheaterService } from './theater.service';
import { Theater } from './schema/theater.schema';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      theater?: Theater;
    }
  }
}

@Injectable()
export class FindTheaterMiddleware implements NestMiddleware {
  constructor(private readonly theaterService: TheaterService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const theaterId = req.params.id;
    console.log(theaterId);
    const theater = await this.theaterService.getTheater(theaterId);
    console.log(theater);
    if (!theater) {
      throw new Error('Screen not found');
    }
    req.theater = theater;

    // console.log(req.theater);
    next();
  }
}
