import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class PhotoService {
    private readonly accessKey: string;
    private readonly baseUrl = 'https://api.unsplash.com';

    constructor(private config: ConfigService) {
        this.accessKey = this.config.get('UNSPLASH_ACCESS_KEY') || '';
    }

    async getPhotoForPlace(placeName: string, city: string) {
        try {
        const { data } = await axios.get(`${this.baseUrl}/search/photos`, {
            headers: {
            Authorization: `Client-ID ${this.accessKey}`,
            },
            params: {
            query: `${placeName} ${city}`,
            per_page: 1,
            orientation: 'landscape',
            },
        });

        if (data.results.length > 0) {
            const photo = data.results[0];
            return {
            url: photo.urls.regular,
            thumbnail: photo.urls.small,
            author: photo.user.name,
            authorUrl: photo.user.links.html,
            };
        }

        return this.getDefaultPhoto(city);
        } catch (error) {
        console.error('Unsplash API error:', error);
        return this.getDefaultPhoto(city);
        }
    }

    async getCityPhotos(city: string, count: number = 5) {
        try {
        const { data } = await axios.get(`${this.baseUrl}/search/photos`, {
            headers: {
            Authorization: `Client-ID ${this.accessKey}`,
            },
            params: {
            query: city,
            per_page: count,
            orientation: 'landscape',
            },
        });

        return data.results.map((photo: any) => ({
            url: photo.urls.regular,
            thumbnail: photo.urls.small,
            author: photo.user.name,
            authorUrl: photo.user.links.html,
        }));
        } catch (error) {
        console.error('Unsplash API error:', error);
        return Array(count).fill(this.getDefaultPhoto(city));
        }
    }

    private getDefaultPhoto(city: string) {
        return {
        url: `https://source.unsplash.com/800x600/?${city},landmark`,
        thumbnail: `https://source.unsplash.com/400x300/?${city},landmark`,
        author: 'Unsplash',
        authorUrl: 'https://unsplash.com',
        };
    }
}