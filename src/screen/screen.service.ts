import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Screen } from './schema/screen.schema';
import { ScreenDto } from './dto/create-screen.dto';

@Injectable()
export class ScreenService {
  constructor(
    @InjectModel(Screen.name) private ScreenModel: mongoose.Model<Screen>,
  ) {}

  async getScreen(id: string): Promise<Screen> {
    return await this.ScreenModel.findById(id);
  }

  async createScreen(
    createScreenDto: ScreenDto,
    theaterId: string,
  ): Promise<Screen> {
    const screen = await this.ScreenModel.create({
      ...createScreenDto,
      theater: theaterId,
    });

    return screen;
  }

  // async getScreenById(id: string): Promise<Screen> {
  //   return await this.ScreenModel.findById(id);
  // }
}
