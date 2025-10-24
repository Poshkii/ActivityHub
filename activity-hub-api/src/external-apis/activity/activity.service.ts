import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ActivityService {
  //private readonly overpassUrl = 'https://overpass-api.de/api/interpreter';
  private readonly overpassUrl = 'https://overpass.kumi.systems/api/interpreter';

  // City bounding boxes [south, west, north, east]
  private readonly cityBounds = {
    vilnius: [54.6372, 25.2297, 54.7372, 25.3297],
    kaunas: [54.8485, 23.8536, 54.9485, 23.9536],
    klaipeda: [55.6533, 21.0943, 55.7533, 21.1943],
  };

  async getActivities(city: string) {
    const cityKey = city.toLowerCase();
    const bounds = this.cityBounds[cityKey] || this.cityBounds.vilnius;

    // Get parks, museums, and tourist attractions
    console.log(`Fetching parks for city: ${cityKey}`);
    const parks = await this.getParks(bounds);
    console.log(`Fetching museums for city: ${cityKey}`);
    const museums = await this.getMuseums(bounds);
    console.log(`Fetching attractions for city: ${cityKey}`);
    const attractions = await this.getTouristAttractions(bounds);
    return [...(parks ?? []), ...(museums ?? []), ...(attractions ?? [])];
  }
  

  private async getParks(bounds: number[]) {
    const query = `
      [out:json];
      (
        node["leisure"="park"](${bounds.join(',')});
        way["leisure"="park"](${bounds.join(',')});
      );
      out center 10;
    `;

    try {
      const { data } = await axios.post(this.overpassUrl, `data=${encodeURIComponent(query)}`);

      if (!data || !data.elements || !Array.isArray(data.elements)) {
        console.warn('No elements returned from Overpass API (parks)');
        return [];
      }
      
      return data.elements.map((element: any) => ({
        id: element.id,
        name: element.tags.name || 'Unnamed Park',
        type: 'park',
        latitude: element.lat || element.center?.lat,
        longitude: element.lon || element.center?.lon,
        description: 'Park and recreation area',
        category: 'Outdoor',
      }));
    } catch (error) {
      console.error('Overpass API error (parks):', error);
      return [];
    }
  }

  private async getMuseums(bounds: number[]) {
    const query = `
      [out:json];
      (
        node["tourism"="museum"](${bounds.join(',')});
        way["tourism"="museum"](${bounds.join(',')});
      );
      out center 10;
    `;

    try {
      const { data } = await axios.post(this.overpassUrl, `data=${encodeURIComponent(query)}`);

      if (!data || !data.elements || !Array.isArray(data.elements)) {
        console.warn('No elements returned from Overpass API (museums)');
        return [];
      }
      
      return data.elements.map((element: any) => ({
        id: element.id,
        name: element.tags.name || 'Museum',
        type: 'museum',
        latitude: element.lat || element.center?.lat,
        longitude: element.lon || element.center?.lon,
        description: 'Cultural museum and exhibitions',
        category: 'Culture',
      }));
    } catch (error) {
        console.error('Overpass API error (museums):', error);
        return [];
    }
  }

  private async getTouristAttractions(bounds: number[]) {
    const query = `
      [out:json];
      (
        node["tourism"="attraction"](${bounds.join(',')});
        node["historic"](${bounds.join(',')});
      );
      out center 10;
    `;

    try {
      const { data } = await axios.post(this.overpassUrl, `data=${encodeURIComponent(query)}`);

      if (!data || !data.elements || !Array.isArray(data.elements)) {
        console.warn('No elements returned from Overpass API (attractions)');
        return [];
      }
      
      return (data.elements || []).slice(0, 5).map((element: any) => ({
        id: element.id,
        name: element.tags.name || 'Tourist Attraction',
        type: 'attraction',
        latitude: element.lat || element.center?.lat,
        longitude: element.lon || element.center?.lon,
        description: element.tags.historic || 'Tourist attraction',
        category: 'Tourism',
      }));
    } catch (error) {
      console.error('Overpass API error (attractions):', error);
      return [];
    }
  }
}