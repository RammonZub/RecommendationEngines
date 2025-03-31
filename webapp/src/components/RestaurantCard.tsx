import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { StarIcon, MapPinIcon, SparklesIcon } from '@heroicons/react/24/solid';

interface Restaurant {
  id: string;
  name: string;
  address: string;
  rating: number;
  review_count: number;
  categories: string[];
  price_range: string;
  average_price: number;
  image_url: string;
  neighborhood: string;
  cuisine_type: string;
  description?: string;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  isAdvertisement?: boolean;
}

// Fallback image if restaurant image is not available or fails to load
const FALLBACK_IMAGE = "https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg";

export default function RestaurantCard({ restaurant, isAdvertisement = false }: RestaurantCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };

  // Handle image load complete
  const handleImageLoaded = () => {
    setImageLoaded(true);
  };

  // Preload important images
  useEffect(() => {
    if (isAdvertisement && restaurant.image_url) {
      // Use the proper way to preload an image
      const preloadImage = () => {
        const img = new window.Image();
        img.src = restaurant.image_url || '';
      };
      preloadImage();
    }
  }, [isAdvertisement, restaurant.image_url]);

  return (
    <div 
      className={`flex flex-col md:flex-row h-full bg-white/90 backdrop-blur-md rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
        isAdvertisement ? 'ring-2 ring-[#006B5A]/30' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div className="relative h-52 md:w-1/3 md:h-auto min-h-full overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-8 h-8 border-2 border-[#006B5A] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <Image 
          src={imageError ? FALLBACK_IMAGE : (restaurant.image_url || FALLBACK_IMAGE)} 
          alt={restaurant.name}
          className={`object-cover transition-transform duration-300 ease-in-out h-full w-full ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${isHovered ? 'scale-110' : 'scale-100'}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          onError={handleImageError}
          onLoad={handleImageLoaded}
          priority={isAdvertisement}
          loading={isAdvertisement ? "eager" : "lazy"}
          quality={70}
        />
        
        {/* Overlay with price range */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-2 py-1 rounded-md shadow-sm">
          <span className="font-medium text-sm text-gray-800">{restaurant.price_range}</span>
        </div>

        {/* Advertisement badge */}
        {isAdvertisement && (
          <div className="absolute top-4 right-4 bg-[#006B5A]/90 backdrop-blur-md px-2 py-1 rounded-md shadow-sm flex items-center">
            <SparklesIcon className="h-3 w-3 text-white mr-1" />
            <span className="font-medium text-xs text-white">Sponsored</span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{restaurant.name}</h3>
            
            <div className="flex flex-wrap gap-1.5 mb-2">
              {restaurant.categories.slice(0, 3).map((category, index) => (
                <span 
                  key={index} 
                  className={`inline-block text-xs px-2 py-0.5 rounded-md ${
                    category === 'Sponsored' 
                      ? 'bg-[#006B5A]/10 text-[#006B5A]' 
                      : 'bg-[#f0f9f7] text-[#006B5A]'
                  }`}
                >
                  {category}
                </span>
              ))}
            </div>
            
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <MapPinIcon className="h-4 w-4 text-gray-400 mr-1 flex-shrink-0" />
              <span className="truncate">{restaurant.address}</span>
            </div>
          </div>
          
          <div className="flex items-center bg-[#f0f9f7] px-2 py-1 rounded-md">
            <StarIcon className="h-4 w-4 text-[#ffa534]" />
            <span className="ml-1 font-bold text-[#006B5A]">{restaurant.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-500 ml-1">({restaurant.review_count})</span>
          </div>
        </div>
        
        {restaurant.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{restaurant.description}</p>
        )}
        
        <div className="mt-auto">
          <button 
            className={`w-full md:w-auto px-4 py-1.5 rounded-lg font-medium text-sm transition-colors duration-200 ${
              isHovered || isAdvertisement
                ? 'bg-[#006B5A] text-white' 
                : 'bg-white/80 text-[#006B5A] border border-[#006B5A]'
            }`}
          >
            Reserve a table
          </button>
        </div>
      </div>
    </div>
  );
} 