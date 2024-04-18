import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTheaterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsOptional()
  @IsMongoId()
  ownerId?: string;
}
