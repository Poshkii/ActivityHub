import { Module } from '@nestjs/common';
import { WeatherService } from './weather/weather.service';
import { RestaurantService } from './restaurant/restaurant.service';
import { ActivityService } from './activity/activity.service';
import { PhotoService } from './photo/photo.service';

@Module({
  providers: [WeatherService, RestaurantService, ActivityService, PhotoService]
})
export class ExternalApisModule {}
