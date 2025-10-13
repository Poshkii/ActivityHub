'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { favoritesService, Favorite } from '@/lib/services/favorite.service';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, MapPin, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FavoritesPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            loadFavorites();
        }
    }, [user]);

    const loadFavorites = async () => {
        try {
            const data = await favoritesService.getAll();
            setFavorites(data);
        } catch (error) {
            console.error('Failed to load favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Remove this favorite?')) return;
        
        try {
            await favoritesService.delete(id);
            setFavorites(favorites.filter(f => f.id !== id));
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    if (authLoading || loading) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">My Favorites</h1>
        
        {favorites.length === 0 ? (
            <Card>
            <CardContent className="p-8 text-center text-gray-500">
                No favorites yet. Start exploring and save places!
            </CardContent>
            </Card>
        ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((fav) => (
                <Card key={fav.id}>
                <CardHeader>
                    <div className="flex items-start justify-between">
                    <div>
                        <h3 className="font-bold text-lg">{fav.placeName}</h3>
                        <p className="text-sm text-gray-500 capitalize">{fav.placeType}</p>
                    </div>
                    {fav.rating && (
                        <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{fav.rating}</span>
                        </div>
                    )}
                    </div>
                </CardHeader>
                <CardContent>
                    {fav.address && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>{fav.address}</span>
                    </div>
                    )}
                    <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                        {new Date(fav.savedAt).toLocaleDateString()}
                    </span>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(fav.id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                    </div>
                </CardContent>
                </Card>
            ))}
            </div>
        )}
        </div>
    );
}