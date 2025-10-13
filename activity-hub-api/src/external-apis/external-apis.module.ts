import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WeatherService } from './weather/weather.service';
import { RestaurantService } from './restaurant/restaurant.service';
import { ActivityService } from './activity/activity.service';
import { PhotoService } from './photo/photo.service';

@Module({
  imports: [ConfigModule],
  providers: [WeatherService, RestaurantService, ActivityService, PhotoService],
  exports: [WeatherService, RestaurantService, ActivityService, PhotoService],
})
export class ExternalApisModule {}
