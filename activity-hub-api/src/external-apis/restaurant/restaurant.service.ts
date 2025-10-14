import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';


@Injectable()
export class RestaurantService {
    private readonly apiKey: string;
    private readonly baseUrl = 'https://places-api.foursquare.com/places/search';
    private readonly apiVersion = '2025-06-17';
    
    private readonly cityCoordinates = {
        vilnius: { lat: 54.6872, lon: 25.2797 },
        kaunas: { lat: 54.8985, lon: 23.9036 },
        klaipeda: { lat: 55.7033, lon: 21.1443 },
    };

    constructor(private config: ConfigService) {
        this.apiKey = this.config.get('FOURSQUARE_API_KEY') ?? "";
    }

    async getRestaurants(city: string, limit: number = 20) {
        const cityKey = city.toLowerCase();
        const coords = this.cityCoordinates[cityKey] || this.cityCoordinates.vilnius;

        try {
            const { data } = await axios.get(this.baseUrl, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Accept': 'application/json',
                    'X-Places-API-Version': this.apiVersion,
                },
                params: {
                    ll: `${coords.lat},${coords.lon}`,
                    categories: '13065', // restaurants
                    limit,
                    radius: 5000,
                },
            });
            return this.mapPlaces(data.results ?? [], 'restaurant');
        } catch (error) {
            console.error('Foursquare API error:', error.response?.data || error.message);
            return [];
        }
    }

    async getCafes(city: string, limit: number = 20) {
        const cityKey = city.toLowerCase();
        const coords = this.cityCoordinates[cityKey] || this.cityCoordinates.vilnius;

        try {
            const { data } = await axios.get(this.baseUrl, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Accept': 'application/json',
                    'X-Places-API-Version': this.apiVersion,
                },
                    params: {
                    ll: `${coords.lat},${coords.lon}`,
                    categories: '13032,13035', // cafes, coffee shops
                    limit,
                    radius: 5000,
                },
            });
            return this.mapPlaces(data.results ?? [], 'cafe');
        } catch (error) {
            console.error('Foursquare API error:', error);
            return [];
        }
    }

    private mapPlaces(places: any[], type: string) {
        return places.map((place) => ({
            id: place.fsq_place_id,
            name: place.name,
            type,
            latitude: typeof place.latitude === "number" ? place.latitude : place.geocodes?.main?.latitude ?? 0,
            longitude: typeof place.longitude === "number" ? place.longitude : place.geocodes?.main?.longitude ?? 0,
            address: place.location?.formatted_address,
            category: place.categories?.[0]?.name || type,
            distance: place.distance,
            rating: place.rating && place.rating > 0 ? place.rating / 2 : null
        }));
    }
}