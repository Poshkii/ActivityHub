'use client';

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

type Place = {
  id?: string | number;
  name?: string;
  placeType?: string;
  latitude: number;
  longitude: number;
  address?: string;
};

export default function MapboxMap({
  places,
  center = [25.2797, 54.6872], // [lng, lat] default Vilnius
  zoom = 10,
}: {
  places: Place[];
  center?: [number, number];
  zoom?: number;
}) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
      console.warn('Please set NEXT_PUBLIC_MAPBOX_TOKEN to use MapboxMap component');
      return;
    }
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (mapRef.current || !mapContainer.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: center as [number, number],
      zoom,
    });

    const map = mapRef.current;

    map.on('load', () => {
      // initial markers handled in effect below
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when places change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // remove existing markers from the map
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // helper to choose marker content/style based on category/placeType
    const createMarkerElement = (p: Place) => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '28px';
      el.style.height = '28px';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.borderRadius = '50%';
      el.style.color = 'white';
      el.style.fontSize = '14px';
      el.style.fontWeight = 'bold';

      const type = (p.placeType || '').toLowerCase();
      console.log('Place type:', p.placeType);
      // choose emoji/icon and background color per type
      if (type.includes('restaurant')) {
        el.textContent = '🍴';
        el.style.background = '#ef4444'; // red
      } else if (type.includes('cafe') || type.includes('coffee')) {
        el.textContent = '☕';
        el.style.background = '#8b5cf6'; // purple
      } else if (type.includes('activity') || type.includes('park') || type.includes('outdoor')) {
        el.textContent = '🧭';
        el.style.background = '#0ea5e9'; // blue
      } else if (type.includes('museum')) {
        el.textContent = '🏨';
        el.style.background = '#f59e0b'; // amber
      } else {
        // default marker
        el.textContent = '📍';
        el.style.background = '#e11d48';
        el.style.fontSize = '20px';
      }

      el.style.cursor = 'pointer';
      return el;
    };

    places.forEach((p) => {
      const el = createMarkerElement(p);
      const marker = new mapboxgl.Marker(el)
        .setLngLat([p.longitude, p.latitude])
        .setPopup(
        new mapboxgl.Popup({ offset: 10 }).setHTML(`
            <strong>${p.name || 'Unnamed'}</strong><br/>
            ${p.address || ''}<br/>
            <em>${p.placeType || ''}</em>
        `)
        )
        .addTo(map);
      markersRef.current.push(marker);
    });

    if (places.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      places.forEach((p) => bounds.extend([p.longitude, p.latitude]));
      map.fitBounds(bounds, { padding: 40, maxZoom: 14 });
    }
  }, [places]);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
