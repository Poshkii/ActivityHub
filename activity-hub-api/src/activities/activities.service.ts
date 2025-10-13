import { Injectable } from '@nestjs/common';
import { WeatherService } from '../external-apis/weather/weather.service';
import { RestaurantService } from '../external-apis/restaurant/restaurant.service';
import { ActivityService } from '../external-apis/activity/activity.service';
import { PhotoService } from '../external-apis/photo/photo.service';

@Injectable()
export class ActivitiesService {
    constructor(
        private weatherService: WeatherService, 
        private restaurantService: RestaurantService, 
        private activityService: ActivityService,
    ) {}

    async getAllActivities(city: string = 'Vilnius') {
        try {
        const [weather, restaurants, cafes, activities] = await Promise.all([
            this.weatherService.getCurrentWeather(city),
            this.restaurantService.getRestaurants(city, 10),
            this.restaurantService.getCafes(city, 5),
            this.activityService.getActivities(city),
        ]);

        return {
            city,
            weather,
            restaurants,
            cafes,
            activities,
            timestamp: new Date().toISOString(),
        };
        } catch (error) {
            console.error('Error fetching activities:', error);
            throw error;
        }
    }

    async getWeatherBasedRecommendations(city: string) {
        const weather = await this.weatherService.getCurrentWeather(city);
        const condition = weather.condition.toLowerCase();

        let recommendations: { type: string; message: string }[] = [];

        if (condition.includes('rain')) {
            // Rainy weather - indoor activities
            recommendations = [
                { type: 'cafe', message: 'Perfect weather for a cozy cafe' },
                { type: 'museum', message: 'Visit a museum to stay dry' },
                { type: 'restaurant', message: 'Great day for a nice meal indoors' },
            ];
        } else if (condition.includes('clear') || condition.includes('sun')) {
            // Sunny weather - outdoor activities
            recommendations = [
                { type: 'park', message: 'Beautiful day for a park visit' },
                { type: 'attraction', message: 'Explore outdoor attractions' },
                { type: 'restaurant', message: 'Try a restaurant with outdoor seating' },
            ];
        } else {
            // Default recommendations
            recommendations = [
                { type: 'restaurant', message: 'Discover local restaurants' },
                { type: 'cafe', message: 'Relax at a nearby cafe' },
                { type: 'park', message: 'Take a walk in the park' },
            ];
        }

        return {
            weather,
            recommendations,
            city,
        };
    }
}
