import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTimeslotDto {
  @IsNumber()
  price: number;

  @IsMongoId()
  movieId: string;
}

export class OptionalDto {
  @IsOptional()
  @IsString()
  start: string;

  @IsOptional()
  @IsString()
  end: string;
}
