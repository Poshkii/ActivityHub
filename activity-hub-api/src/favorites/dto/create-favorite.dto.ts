import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateFavoriteDto {
  @ApiProperty({ example: 'Čili Pica' })
  @IsString()
  placeName: string;

  @ApiProperty({ example: 'restaurant' })
  @IsString()
  placeType: string;

  @ApiProperty({ example: 54.6872 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 25.2797 })
  @IsNumber()
  longitude: number;

  @ApiProperty({ required: false, example: 'Laisvės al. 60, Kaunas' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false, minimum: 1, maximum: 5, example: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;
}