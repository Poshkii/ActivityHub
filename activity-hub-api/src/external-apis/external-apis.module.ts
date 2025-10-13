import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WeatherService } from './weather/weather.service';
import { RestaurantService } from './restaurant/restaurant.service';
import { ActivityService } from './activity/activity.service';

@Module({
  imports: [ConfigModule],
  providers: [WeatherService, RestaurantService, ActivityService],
  exports: [WeatherService, RestaurantService, ActivityService],
})
export class ExternalApisModule {}
