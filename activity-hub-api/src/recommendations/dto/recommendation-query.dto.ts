import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class RecommendationQueryDto {
  @ApiProperty({ 
    required: false, 
    example: 'sunny',
    description: 'Current weather condition (sunny, rainy, cloudy, etc.)'
  })
  @IsOptional()
  @IsString()
  weatherCondition?: string;
}