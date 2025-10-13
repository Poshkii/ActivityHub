import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ActivitiesService } from './activities.service';
import { ActivityQueryDto } from './dto/activity-query.dto';
import { WeatherService } from '../external-apis/weather/weather.service';
import { RestaurantService } from '../external-apis/restaurant/restaurant.service';
import { ActivityService } from '../external-apis/activity/activity.service';

@ApiTags('activities')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('activities')
export class ActivitiesController {
    constructor(
        private activitiesService: ActivitiesService,
        //private weatherService: WeatherService,
        //private restaurantService: RestaurantService,
        //private activityService: ActivityService,
    ) {}

    @Get('all')
    @ApiOperation({ summary: 'Get all activities for a city' })
    getAllActivities(@Query() query: ActivityQueryDto) {
        return this.activitiesService.getAllActivities(query.city);
    }

    @Get('recommendations')
    @ApiOperation({ summary: 'Get weather-based recommendations' })
    getRecommendations(@Query('city') city: string = 'Vilnius') {
        return this.activitiesService.getWeatherBasedRecommendations(city);
    }

    /*
    // Test endpoints (remove in production)
    @Get('test/weather')
    testWeather(@Query('city') city: string = 'Vilnius') {
        return this.weatherService.getCurrentWeather(city);
    }

    @Get('test/restaurants')
    testRestaurants(@Query('city') city: string = 'Vilnius') {
        return this.restaurantService.getRestaurants(city);
    }

    @Get('test/cafes')
    testCafes(@Query('city') city: string = 'Vilnius') {
        return this.restaurantService.getCafes(city);
    }

    @Get('test/activities')
    testActivities(@Query('city') city: string = 'Vilnius') {
        return this.activityService.getActivities(city);
    }
    */
}