"use client";

import React, { useEffect, useState } from "react";
import CitySelect from "@/app/components/CitySelect";

export default function ActivitiesPage() {
  const cities = ["Vilnius", "Kaunas", "Klaipėda", "Šiauliai", "Panevėžys"];
  const [city, setCity] = useState<string>(cities[0]);
  const [activities, setActivities] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  useEffect(() => {
    // Fetch activities and recommendations when city changes
    async function fetchData() {
      setLoading(true);
      try {
        const [actsRes, recRes] = await Promise.all([
          fetch(`${apiBase}/activities/all?city=${encodeURIComponent(city)}`),
          fetch(`${apiBase}/activities/recommendations?city=${encodeURIComponent(city)}`),
        ]);

        const acts = actsRes.ok ? await actsRes.json() : [];
        const rec = recRes.ok ? await recRes.json() : [];
        setActivities(acts);
        setRecommendations(rec);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [city]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Activities</h1>

      <CitySelect cities={cities} value={city} onChange={setCity} />

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Recommendations for {city}</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {recommendations && recommendations.length ? (
              recommendations.map((r: any, i: number) => <li key={i}>{JSON.stringify(r)}</li>)
            ) : (
              <li>No recommendations</li>
            )}
          </ul>
        )}
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Activities for {city}</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {activities && activities.length ? (
              activities.map((a: any, i: number) => <li key={i}>{JSON.stringify(a)}</li>)
            ) : (
              <li>No activities</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
