'use client';

import React from 'react';

export default function CitySelect({
  cities,
  value,
  onChange,
}: {
  cities: string[];
  value: string;
  onChange: (city: string) => void;
}) {
  return (
    <div className='flex items-center justify-between' style={{width: 'auto'}}>
      <div className="text-2xl font-bold " style={{marginRight: "2rem"}}>Select city:</div>
      <div>
        <select
            id="city"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg"
        >
            {cities.map((c) => (
            <option key={c} value={c}>
                {c}
            </option>
            ))}
        </select>
      </div>
    </div>
  );
}
