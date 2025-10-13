import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WeatherService {
    private readonly apiKey: string;
    private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';

    constructor(private config: ConfigService) {
        this.apiKey = this.config.get('OPENWEATHER_API_KEY') ?? "";
    }

    async getCurrentWeather(city: string) {
        try {
        const { data } = await axios.get(`${this.baseUrl}/weather`, {
            params: {
            q: city,
            appid: this.apiKey,
            units: 'metric', // Celsius
            },
        });

        return {
            temperature: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            condition: data.weather[0].main,
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            icon: data.weather[0].icon,
            city: data.name,
        };
        } catch (error) {
        throw new HttpException(
            `Weather API error: ${error.message}`,
            error.response?.status || 500,
        );
        }
    }

    async getForecast(city: string, days: number = 5) {
        try {
        const { data } = await axios.get(`${this.baseUrl}/forecast`, {
            params: {
            q: city,
            appid: this.apiKey,
            units: 'metric',
            cnt: days * 8, // 8 readings per day (every 3 hours)
            },
        });

        return data.list.map((item: any) => ({
            date: item.dt_txt,
            temperature: Math.round(item.main.temp),
            condition: item.weather[0].main,
            description: item.weather[0].description,
        }));
        } catch (error) {
        throw new HttpException('Forecast API error', 500);
        }
    }
}
