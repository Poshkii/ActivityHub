import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ActivityQueryDto {
  @ApiProperty({ required: false, example: 'Vilnius', default: 'Vilnius' })
  @IsOptional()
  @IsString()
  city?: string = 'Vilnius';
}