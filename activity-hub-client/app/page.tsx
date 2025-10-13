'use client';

import Image from "next/image";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cloud, MapPin, Heart, Droplet, Wind, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { favoritesService } from '@/lib/services/favorite.service';
import CitySelect from "@/app/components/CitySelect";
import MapboxMap from "@/app/components/MapboxMap";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);

  const cities = ["Vilnius", "Kaunas", "Klaipėda"];
  const [city, setCity] = useState<string>(cities[0]);

  const [showRestaurants, setShowRestaurants] = useState(true);
  const showRestaurantsText = showRestaurants ? "Hide" : "Show";
  const [showCafes, setShowRCafes] = useState(true);
  const showCafeText = showCafes ? "Hide" : "Show";
  const [showActivities, setShowActivities] = useState(true);
  const showActvitiesText = showActivities ? "Hide" : "Show";
  // Filter for activities by exact type (e.g. 'park', 'museum', 'attraction')
  const [activityFilter, setActivityFilter] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadActivities();
      loadRecommendations();
    }
  }, [user, city]);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/activities/all?city=' + encodeURIComponent(city));
      setData(response.data);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    try {
      const res = await apiClient.get('/activities/recommendations?city=' + encodeURIComponent(city));
      setRecommendations(res.data);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    }
  };

  const handleRestaurantClick = () => {
    setShowRestaurants(prev => !prev);
  }

  const handleCafeClick = () => {
    setShowRCafes(prev => !prev);
  }

  const handleActivityClick = () => {
    setShowActivities(prev => !prev);
  }

  const applyRecommendation = (type: string | null) => {
    setActivityFilter(type);
    console.log('Applied recommendation filter:', type);
  }

  const handleAddFavorite = async (place: any) => {
    try {
      await favoritesService.create({
        placeName: place.name,
        placeType: place.type || 'place',
        latitude: place.latitude,
        longitude: place.longitude,
        address: place.address,
        rating: place.rating,
      });
      alert('Added to favorites!');
    } catch (error) {
      console.error('Failed to add favorite:', error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Activity Hub {city}</h1>
        <CitySelect cities={cities} value={city} onChange={setCity} />
      </div>

      {authLoading || loading ? (
        <div className="p-8">Loading...</div>
      ) : (
        <>
          {/* Weather Card */}
          {data?.weather && (
            <Card className="mb-6 mt-6">
              <div className="flex flex-row justify-around">
              <CardContent>
                <div>Temperature</div>
                <div className="flex items-center gap-4">
                  <Cloud className="w-12 h-12" />
                  <div>
                    <p className="text-3xl font-bold">{data.weather.temperature} °C</p>
                    <p className="text-gray-600">{data.weather.condition}</p>
                  </div>
                </div>
              </CardContent>
              <CardContent>
                <div>Humidity</div>
                <div className="flex items-center gap-4">
                  <Droplet className="w-12 h-12"/>
                  <div>
                    <p className="text-3xl font-bold">{data.weather.humidity} g/kg</p>
                  </div>
                </div>
              </CardContent>
              <CardContent>
                <div>Wind</div>
                <div className="flex items-center gap-4">
                  <Wind className="w-12 h-12" />
                  <div>
                    <p className="text-3xl font-bold">{data.weather.windSpeed} m/s</p>
                  </div>
                </div>
              </CardContent>
              </div>
              <div>
              <CardContent>
                {/* Map */}
                <div>
                    <MapboxMap
                      places={
                        [
                          ...(data?.restaurants || [])
                          .filter((a: any) => !activityFilter || a.type === activityFilter)
                          .map((r: any) => ({
                            id: r.id || r.name,
                            name: r.name,
                            latitude: r.latitude,
                            longitude: r.longitude,
                            address: r.address,
                            placeType: r.type,
                          })),
                          ...(data?.cafes || [])
                          .filter((a: any) => !activityFilter || a.type === activityFilter)
                          .map((c: any) => ({
                            id: c.id || c.name,
                            name: c.name,
                            latitude: c.latitude,
                            longitude: c.longitude,
                            address: c.address,
                            placeType: c.type,
                          })),
                          ...((data?.activities || [])
                            .filter((a: any) => !activityFilter || a.type === activityFilter)
                            .map((a: any) => ({
                              id: a.id || a.name,
                              name: a.name,
                              latitude: a.latitude,
                              longitude: a.longitude,
                              address: a.address,
                              placeType: a.type,
                            }))
                          ),
                        ]
                      }
                    />
                  </div>
              </CardContent>
              </div>
            </Card>
          )}

          {/* Recommendations */}
          {recommendations?.recommendations && (
            <Card className="mb-6">
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Recommendations</h3>
                  <div className="text-sm text-gray-500">{recommendations.city}</div>
                </div>
                <div className="grid gap-3">
                  {recommendations.recommendations.map((rec: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{rec.type}</div>
                        <div className="text-sm text-gray-600">{rec.message}</div>
                      </div>
                      <div>
                        <Button size="sm" onClick={() => applyRecommendation(rec.type)}>
                          Apply
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="mt-2">
                    <Button size="sm" onClick={() => applyRecommendation(null)}>Clear filter</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Restaurants */}
          <div className="mb-8">
            <div className="flex flex-row items-center mb-3">
              <h2 className="text-2xl font-bold">Restaurants</h2>
              <Button className="ml-5" onClick={handleRestaurantClick}><h3>{showRestaurantsText}</h3></Button>
            </div>
            {showRestaurants ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data?.restaurants?.map((restaurant: any, idx: number) => (
                  <Card key={idx}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                      <div>
                          <h3 className="font-bold text-lg">{restaurant.name}</h3>
                          <p className="text-sm text-gray-500 capitalize">{restaurant.type}</p>
                      </div>
                      {restaurant.rating && (
                          <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{restaurant.rating}</span>
                          </div>
                      )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>{restaurant.address}</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddFavorite(restaurant)}
                        className="w-full"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Add to Favorites
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : <div style={{display:"none"}}></div>}
          </div>

          {/* Cafes */}
          <div className="mb-8">
            <div className="flex flex-row items-center mb-3">
              <h2 className="text-2xl font-bold">Cafes</h2>
              <Button className="ml-5" onClick={handleCafeClick}><h3>{showCafeText}</h3></Button>
            </div>
            {showCafes ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data?.cafes?.map((cafe: any, idx: number) => (
                  <Card key={idx}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                      <div>
                          <h3 className="font-bold text-lg">{cafe.name}</h3>
                          <p className="text-sm text-gray-500 capitalize">{cafe.type}</p>
                      </div>
                      {cafe.rating && (
                          <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{cafe.rating}</span>
                          </div>
                      )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>{cafe.address}</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddFavorite(cafe)}
                        className="w-full"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Add to Favorites
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : <div style={{display:"none"}}></div>}
          </div>

          {/* Activities */}
          <div>
            <div className="flex flex-row items-center mb-3">
              <h2 className="text-2xl font-bold">Activities</h2>
              <Button className="ml-5" onClick={handleActivityClick}><h3>{showActvitiesText}</h3></Button>
            </div>
            {showActivities ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data?.activities?.map((activity: any, idx: number) => (
                  <Card key={idx}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                      <div>
                          <h3 className="font-bold text-lg">{activity.name}</h3>
                          <p className="text-sm text-gray-500 capitalize">{activity.type}</p>
                      </div>
                      </div>
                  </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">{activity.address}</p>
                      <Button
                        size="sm"
                        onClick={() => handleAddFavorite(activity)}
                        className="w-full"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Add to Favorites
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : <div style={{display:"none"}}></div>}
          </div>
        </>
      )}
    </div>
  );
}
