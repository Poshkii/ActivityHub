import { apiClient } from '../api/client';

export interface Favorite {
    id: number;
    placeName: string;
    placeType: string;
    latitude: number;
    longitude: number;
    address?: string;
    rating?: number;
    savedAt: string;
}

export interface CreateFavoriteDto {
    placeName: string;
    placeType: string;
    latitude: number;
    longitude: number;
    address?: string;
    rating?: number;
}

export const favoritesService = {
    async create(data: CreateFavoriteDto): Promise<Favorite> {
        const response = await apiClient.post('/favorites', data);
        return response.data;
    },

    async getAll(placeType?: string): Promise<Favorite[]> {
        const params = placeType ? { placeType } : {};
        const response = await apiClient.get('/favorites', { params });
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await apiClient.delete(`/favorites/${id}`);
    },
};