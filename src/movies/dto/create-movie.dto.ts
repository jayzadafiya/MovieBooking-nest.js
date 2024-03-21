export class CreateMovieDto {
  title: string;

  description: string;

  genre: string[];

  duration: number;

  release_date: Date;

  rating: number;
}
