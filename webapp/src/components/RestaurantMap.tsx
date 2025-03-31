'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { StarIcon } from '@heroicons/react/24/solid';

// Fix Leaflet icon issue for Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Simple custom icon
const sponsoredIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
  className: 'sponsored-marker'
});

interface Restaurant {
  id: string;
  name: string;
  cuisine_type: string;
  rating: number;
  price_range: string;
  address: string;
  latitude: number;
  longitude: number;
  isAdvertisement?: boolean;
}

interface RestaurantMapProps {
  restaurants: Restaurant[];
}

export default function RestaurantMap({ restaurants }: RestaurantMapProps) {
  const [mounted, setMounted] = useState(false);
  
  // Set default center to NYC
  const defaultCenter: [number, number] = [40.7128, -74.0060];
  
  // Only render the map on the client side
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // If no restaurants provided, show placeholder
  if (restaurants.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-500">No restaurants to display</p>
      </div>
    );
  }
  
  // Don't render map on server
  if (!mounted) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }
  
  return (
    <div className="h-full w-full">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            position={[restaurant.latitude, restaurant.longitude]}
            icon={restaurant.isAdvertisement ? sponsoredIcon : new L.Icon.Default()}
          >
            <Popup>
              <div className="p-1">
                <h3 className="text-sm font-semibold">{restaurant.name}</h3>
                <div className="flex items-center text-xs mt-1">
                  <StarIcon className="h-3 w-3 text-yellow-500" />
                  <span className="ml-0.5 font-medium">{restaurant.rating.toFixed(1)}</span>
                  <span className="mx-1">·</span>
                  <span>{restaurant.price_range}</span>
                  {restaurant.isAdvertisement && (
                    <span className="ml-1 text-xs text-green-700 font-medium">· Sponsored</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">{restaurant.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <style jsx global>{`
        .leaflet-container {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 0.5rem;
        }
        .leaflet-popup-content {
          margin: 0.5rem;
          min-width: 150px;
        }
        .sponsored-marker {
          filter: drop-shadow(0 0 3px rgba(0, 100, 0, 0.5));
        }
      `}</style>
    </div>
  );
} 