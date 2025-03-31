'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import RestaurantCard from '@/components/RestaurantCard';
import Filters from '@/components/Filters';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import { StarIcon } from '@heroicons/react/24/solid';

// Dynamically import the map component with SSR disabled
const RestaurantMap = dynamic(() => import('@/components/RestaurantMap'), { ssr: false });

// Advertisement restaurant data - will always be shown at the top
const advertisementRestaurant = {
  id: "ad-1",
  name: "Le Bernardin",
  address: "155 W 51st St, Midtown Manhattan",
  rating: 9.6,
  review_count: 2450,
  categories: ["Sponsored", "Seafood", "Fine Dining"],
  price_range: "$$$",
  average_price: 180,
  description: "Michelin-starred seafood restaurant by Chef Eric Ripert, with elegant decor and exquisite tasting menus.",
  image_url: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg",
  neighborhood: "Midtown",
  latitude: 40.7614,
  longitude: -73.9814, 
  cuisine_type: "Seafood",
  ratings: {food: 9.8, service: 9.5, ambience: 9.6},
  isAdvertisement: true
};

// Default center location for New York (Times Square)
const NYC_CENTER = {
  latitude: 40.7580,
  longitude: -73.9855
};

// Local restaurant data for non-signed-in users (top restaurants)
const topRestaurants = [
  {
    id: "1",
    name: "Katz's Delicatessen",
    address: "205 E Houston St, Lower East Side",
    rating: 9.2,
    review_count: 3250,
    categories: ["Deli", "American", "Sandwiches"],
    price_range: "$$",
    average_price: 25,
    description: "Famous for their pastrami sandwiches, this iconic deli has been serving New York since 1888.",
    image_url: "https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg",
    neighborhood: "Lower East Side",
    latitude: 40.7223,
    longitude: -73.9874,
    cuisine_type: "Deli",
    ratings: {food: 9.5, service: 8.8, ambience: 8.9}
  },
  {
    id: "2",
    name: "Peter Luger Steak House",
    address: "178 Broadway, Williamsburg, Brooklyn",
    rating: 9.4,
    review_count: 2890,
    categories: ["Steakhouse", "American", "Fine Dining"],
    price_range: "$$$",
    average_price: 115,
    description: "Legendary steakhouse serving dry-aged beef since 1887 in a beer-hall-style setting.",
    image_url: "https://images.pexels.com/photos/3535383/pexels-photo-3535383.jpeg",
    neighborhood: "Williamsburg",
    latitude: 40.7099,
    longitude: -73.9622,
    cuisine_type: "Steakhouse",
    ratings: {food: 9.7, service: 9.0, ambience: 9.1}
  },
  {
    id: "3",
    name: "Eleven Madison Park",
    address: "11 Madison Ave, Flatiron District",
    rating: 9.7,
    review_count: 1800,
    categories: ["Fine Dining", "Contemporary", "Tasting Menu"],
    price_range: "$$$$",
    average_price: 335,
    description: "Three Michelin-starred restaurant offering an artful plant-based tasting menu in an art deco space.",
    image_url: "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg",
    neighborhood: "Flatiron District",
    latitude: 40.7416,
    longitude: -73.9872,
    cuisine_type: "Contemporary",
    ratings: {food: 9.8, service: 9.7, ambience: 9.9}
  },
  {
    id: "4",
    name: "Gramercy Tavern",
    address: "42 E 20th St, Flatiron District",
    rating: 9.3,
    review_count: 2150,
    categories: ["American", "Farm-to-Table", "Fine Dining"],
    price_range: "$$$",
    average_price: 95,
    description: "Sophisticated American restaurant with seasonal, farm-to-table cuisine in a warm, upscale setting.",
    image_url: "https://images.pexels.com/photos/5491004/pexels-photo-5491004.jpeg",
    neighborhood: "Flatiron District",
    latitude: 40.7387,
    longitude: -73.9885,
    cuisine_type: "American",
    ratings: {food: 9.4, service: 9.5, ambience: 9.3}
  },
  {
    id: "5",
    name: "Balthazar",
    address: "80 Spring St, SoHo",
    rating: 9.1,
    review_count: 2200,
    categories: ["French", "Brasserie", "Brunch"],
    price_range: "$$$",
    average_price: 70,
    description: "Bustling Parisian-style brasserie serving French classics in a grand, theatrical setting.",
    image_url: "https://images.pexels.com/photos/1579739/pexels-photo-1579739.jpeg",
    neighborhood: "SoHo",
    latitude: 40.7227,
    longitude: -73.9981,
    cuisine_type: "French",
    ratings: {food: 9.2, service: 9.0, ambience: 9.4}
  },
  {
    id: "6",
    name: "Russ & Daughters Cafe",
    address: "127 Orchard St, Lower East Side",
    rating: 9.0,
    review_count: 1700,
    categories: ["Jewish", "Breakfast", "Deli"],
    price_range: "$$",
    average_price: 35,
    description: "Sit-down restaurant version of the iconic appetizing store, famous for bagels, lox, and Jewish comfort food.",
    image_url: "https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg",
    neighborhood: "Lower East Side",
    latitude: 40.7193,
    longitude: -73.9886,
    cuisine_type: "Jewish",
    ratings: {food: 9.3, service: 8.8, ambience: 8.9}
  }
];

// Random restaurants for "Try Something New" and "Discover New Taste"
const randomRestaurants = [
  {
    id: "r1",
    name: "Cosme",
    address: "35 E 21st St, Flatiron District",
    rating: 9.3,
    review_count: 1760,
    categories: ["Mexican", "Contemporary", "Upscale"],
    price_range: "$$$",
    average_price: 95,
    description: "Modern Mexican restaurant by Chef Enrique Olvera featuring creative dishes and a contemporary atmosphere.",
    image_url: "https://images.pexels.com/photos/5718025/pexels-photo-5718025.jpeg",
    neighborhood: "Flatiron District",
    latitude: 40.7400,
    longitude: -73.9897,
    cuisine_type: "Mexican",
    ratings: {food: 9.4, service: 9.2, ambience: 9.3}
  },
  {
    id: "r2",
    name: "Atomix",
    address: "104 E 30th St, NoMad",
    rating: 9.7,
    review_count: 920,
    categories: ["Korean", "Fine Dining", "Tasting Menu"],
    price_range: "$$$$",
    average_price: 270,
    description: "Innovative Korean fine dining restaurant offering a multi-course tasting menu with detailed card explanations.",
    image_url: "https://images.pexels.com/photos/2664216/pexels-photo-2664216.jpeg",
    neighborhood: "NoMad",
    latitude: 40.7445,
    longitude: -73.9834,
    cuisine_type: "Korean",
    ratings: {food: 9.8, service: 9.6, ambience: 9.7}
  },
  {
    id: "r3",
    name: "Adda",
    address: "31-31 Thomson Ave, Long Island City",
    rating: 9.1,
    review_count: 1080,
    categories: ["Indian", "Regional", "Spicy"],
    price_range: "$$",
    average_price: 45,
    description: "Authentic Indian restaurant serving regional dishes in a casual, vibrant setting.",
    image_url: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg",
    neighborhood: "Long Island City",
    latitude: 40.7445,
    longitude: -73.9339,
    cuisine_type: "Indian",
    ratings: {food: 9.4, service: 8.9, ambience: 8.7}
  },
  {
    id: "r4",
    name: "Di Fara Pizza",
    address: "1424 Avenue J, Midwood, Brooklyn",
    rating: 9.3,
    review_count: 1870,
    categories: ["Pizza", "Italian", "Legendary"],
    price_range: "$$",
    average_price: 30,
    description: "Legendary Brooklyn pizzeria where Dom DeMarco has been making pizza by hand for over 50 years.",
    image_url: "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg",
    neighborhood: "Midwood",
    latitude: 40.6252,
    longitude: -73.9618,
    cuisine_type: "Pizza",
    ratings: {food: 9.7, service: 8.3, ambience: 8.0}
  },
  {
    id: "r5",
    name: "Atla",
    address: "372 Lafayette St, NoHo",
    rating: 8.9,
    review_count: 1320,
    categories: ["Mexican", "All Day", "Casual"],
    price_range: "$$",
    average_price: 45,
    description: "Casual all-day Mexican restaurant with bright, modern decor and creative light fare.",
    image_url: "https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg",
    neighborhood: "NoHo",
    latitude: 40.7274,
    longitude: -73.9937,
    cuisine_type: "Mexican",
    ratings: {food: 9.1, service: 8.8, ambience: 9.0}
  },
  {
    id: "r6",
    name: "Oxomoco",
    address: "128 Greenpoint Ave, Greenpoint",
    rating: 9.0,
    review_count: 1190,
    categories: ["Mexican", "Wood-Fired", "Casual Upscale"],
    price_range: "$$$",
    average_price: 60,
    description: "Michelin-starred Mexican restaurant with wood-fired cooking in a bright, plant-filled space.",
    image_url: "https://images.pexels.com/photos/2233729/pexels-photo-2233729.jpeg",
    neighborhood: "Greenpoint",
    latitude: 40.7303,
    longitude: -73.9543,
    cuisine_type: "Mexican",
    ratings: {food: 9.2, service: 8.9, ambience: 9.1}
  }
];

// Seasonal recommendations
const seasonalRestaurants = [
  {
    id: "s1",
    name: "Dante",
    address: "79-81 MacDougal St, Greenwich Village",
    rating: 9.1,
    review_count: 1430,
    categories: ["Cocktail Bar", "Italian", "Seasonal"],
    price_range: "$$",
    average_price: 65,
    description: "Historic bar and restaurant with seasonal craft cocktails and Italian small plates. Perfect for summer evenings.",
    image_url: "https://images.pexels.com/photos/1484516/pexels-photo-1484516.jpeg",
    neighborhood: "Greenwich Village",
    latitude: 40.7295,
    longitude: -74.0025,
    cuisine_type: "Italian",
    ratings: {food: 9.0, service: 9.3, ambience: 9.5}
  },
  {
    id: "s2",
    name: "Westlight",
    address: "111 N 12th St, Williamsburg",
    rating: 9.2,
    review_count: 1200,
    categories: ["American", "Rooftop", "Cocktails"],
    price_range: "$$$",
    average_price: 80,
    description: "Rooftop bar and restaurant with panoramic views of Manhattan skyline. Ideal for warm weather dining.",
    image_url: "https://images.pexels.com/photos/2403391/pexels-photo-2403391.jpeg",
    neighborhood: "Williamsburg",
    latitude: 40.7222,
    longitude: -73.9574,
    cuisine_type: "American",
    ratings: {food: 8.9, service: 9.0, ambience: 9.8}
  },
  {
    id: "s3",
    name: "Grand Banks",
    address: "Pier 25, Hudson River Park",
    rating: 9.0,
    review_count: 1100,
    categories: ["Seafood", "Oyster Bar", "Seasonal"],
    price_range: "$$$",
    average_price: 75,
    description: "Seasonal oyster bar on a historic wooden schooner on the Hudson River. Open during warmer months.",
    image_url: "https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg",
    neighborhood: "Tribeca",
    latitude: 40.7207,
    longitude: -74.0142,
    cuisine_type: "Seafood",
    ratings: {food: 9.1, service: 8.8, ambience: 9.6}
  },
  {
    id: "s4",
    name: "Frenchette",
    address: "241 W Broadway, Tribeca",
    rating: 9.3,
    review_count: 1250,
    categories: ["French", "Bistro", "Seasonal"],
    price_range: "$$$",
    average_price: 85,
    description: "Modern French bistro with a rotating seasonal menu featuring local ingredients.",
    image_url: "https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg",
    neighborhood: "Tribeca",
    latitude: 40.7194,
    longitude: -74.0050,
    cuisine_type: "French",
    ratings: {food: 9.4, service: 9.2, ambience: 9.1}
  },
  {
    id: "s5",
    name: "Upland",
    address: "345 Park Ave S, Gramercy",
    rating: 9.1,
    review_count: 1320,
    categories: ["California", "Seasonal", "Wine Bar"],
    price_range: "$$$",
    average_price: 70,
    description: "California-inspired restaurant with seasonal ingredients and impressive wine list in a modern space.",
    image_url: "https://images.pexels.com/photos/683039/pexels-photo-683039.jpeg",
    neighborhood: "Gramercy",
    latitude: 40.7426,
    longitude: -73.9857,
    cuisine_type: "American",
    ratings: {food: 9.2, service: 9.0, ambience: 9.3}
  }
];

// Mock personalized recommendations for signed-in users - West Village area
const personalizedRecommendations = [
  {
    id: "p1",
    name: "Via Carota",
    address: "51 Grove St, West Village",
    rating: 9.4,
    review_count: 1543,
    categories: ["Italian", "Pasta", "Wine Bar"],
    price_range: "$$$",
    average_price: 65,
    description: "Beloved Italian restaurant known for pasta, vegetables, and rustic atmosphere. No reservations policy.",
    image_url: "https://images.pexels.com/photos/784633/pexels-photo-784633.jpeg",
    neighborhood: "West Village",
    latitude: 40.7334,
    longitude: -74.0027,
    cuisine_type: "Italian",
    ratings: {food: 9.6, service: 9.2, ambience: 9.3}
  },
  {
    id: "p2",
    name: "L'Artusi",
    address: "228 W 10th St, West Village",
    rating: 9.3,
    review_count: 1329,
    categories: ["Italian", "Wine Bar", "Pasta"],
    price_range: "$$$",
    average_price: 75,
    description: "Sophisticated Italian restaurant with a fantastic wine list, modern decor, and a lively atmosphere.",
    image_url: "https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg",
    neighborhood: "West Village",
    latitude: 40.7342,
    longitude: -74.0048,
    cuisine_type: "Italian",
    ratings: {food: 9.4, service: 9.2, ambience: 9.3}
  },
  {
    id: "p3",
    name: "Minetta Tavern",
    address: "113 MacDougal St, Greenwich Village",
    rating: 9.2,
    review_count: 1815,
    categories: ["Steakhouse", "French", "American"],
    price_range: "$$$",
    average_price: 95,
    description: "Historic tavern known for exceptional steaks, particularly the Black Label Burger, in a vintage atmosphere.",
    image_url: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg",
    neighborhood: "Greenwich Village",
    latitude: 40.7302,
    longitude: -74.0005,
    cuisine_type: "Steakhouse",
    ratings: {food: 9.5, service: 9.1, ambience: 9.4}
  },
  {
    id: "p4",
    name: "Joe's Pizza",
    address: "7 Carmine St, West Village",
    rating: 9.0,
    review_count: 2450,
    categories: ["Pizza", "Italian", "Quick Bite"],
    price_range: "$",
    average_price: 12,
    description: "Iconic New York slice shop serving simple, classic pizza since 1975.",
    image_url: "https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg",
    neighborhood: "West Village",
    latitude: 40.7306,
    longitude: -74.0023,
    cuisine_type: "Pizza",
    ratings: {food: 9.3, service: 8.5, ambience: 8.2}
  },
  {
    id: "p5",
    name: "Blue Hill",
    address: "75 Washington Pl, Greenwich Village",
    rating: 9.5,
    review_count: 1321,
    categories: ["American", "Farm-to-Table", "Fine Dining"],
    price_range: "$$$$",
    average_price: 140,
    description: "Farm-to-table pioneer offering sophisticated seasonal cuisine sourced from nearby farms.",
    image_url: "https://images.pexels.com/photos/1484516/pexels-photo-1484516.jpeg",
    neighborhood: "Greenwich Village",
    latitude: 40.7312,
    longitude: -73.9997,
    cuisine_type: "American",
    ratings: {food: 9.7, service: 9.5, ambience: 9.4}
  }
];

// New section: Unique "Try Something New" restaurants for non-authenticated users
const tryNewRestaurants = [
  {
    id: "t1",
    name: "Wildair",
    address: "142 Orchard St, Lower East Side",
    rating: 9.2,
    review_count: 1250,
    categories: ["Natural Wine", "Small Plates", "Innovative"],
    price_range: "$$$",
    average_price: 65,
    description: "Casual, innovative restaurant with natural wines and creative small plates in an intimate setting.",
    image_url: "https://images.pexels.com/photos/541216/pexels-photo-541216.jpeg",
    neighborhood: "Lower East Side",
    latitude: 40.7200,
    longitude: -73.9879,
    cuisine_type: "Contemporary",
    ratings: {food: 9.4, service: 8.9, ambience: 9.0}
  },
  {
    id: "t2",
    name: "Kings Co Imperial",
    address: "20 Skillman Ave, Williamsburg",
    rating: 8.9,
    review_count: 1050,
    categories: ["Chinese", "Szechuan", "Dumpling"],
    price_range: "$$",
    average_price: 40,
    description: "Modern Chinese restaurant serving authentic Szechuan cuisine with ingredients from their own garden.",
    image_url: "https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg",
    neighborhood: "Williamsburg",
    latitude: 40.7157,
    longitude: -73.9375,
    cuisine_type: "Chinese",
    ratings: {food: 9.2, service: 8.7, ambience: 8.8}
  },
  {
    id: "t3",
    name: "Superiority Burger",
    address: "119 Avenue A, East Village",
    rating: 8.8,
    review_count: 980,
    categories: ["Vegetarian", "Burgers", "Small Plates"],
    price_range: "$",
    average_price: 18,
    description: "Tiny vegetarian burger joint with creative sides by James Beard Award-winning chef Brooks Headley.",
    image_url: "https://images.pexels.com/photos/2983098/pexels-photo-2983098.jpeg",
    neighborhood: "East Village",
    latitude: 40.7265,
    longitude: -73.9815,
    cuisine_type: "Vegetarian",
    ratings: {food: 9.0, service: 8.5, ambience: 8.2}
  },
  {
    id: "t4",
    name: "St. Anselm",
    address: "355 Metropolitan Ave, Williamsburg",
    rating: 9.1,
    review_count: 1380,
    categories: ["Steakhouse", "Grilled", "Casual"],
    price_range: "$$",
    average_price: 55,
    description: "Casual steakhouse with perfectly grilled meats and seafood at affordable prices in a rustic space.",
    image_url: "https://images.pexels.com/photos/410648/pexels-photo-410648.jpeg",
    neighborhood: "Williamsburg",
    latitude: 40.7133,
    longitude: -73.9544,
    cuisine_type: "Steakhouse",
    ratings: {food: 9.3, service: 8.9, ambience: 8.7}
  },
  {
    id: "t5",
    name: "Win Son",
    address: "159 Graham Ave, East Williamsburg",
    rating: 9.0,
    review_count: 1120,
    categories: ["Taiwanese", "Casual", "Innovative"],
    price_range: "$$",
    average_price: 38,
    description: "Modern Taiwanese-American restaurant with creative dishes in a lively, casual setting.",
    image_url: "https://images.pexels.com/photos/1001773/pexels-photo-1001773.jpeg",
    neighborhood: "East Williamsburg",
    latitude: 40.7096,
    longitude: -73.9452,
    cuisine_type: "Taiwanese",
    ratings: {food: 9.2, service: 8.8, ambience: 8.9}
  }
];

interface Restaurant {
  id: string;
  name: string;
  cuisine_type: string;
  rating: number;
  price_range: string;
  image_url: string;
  address: string;
  neighborhood: string;
  categories: string[];
  latitude: number;
  longitude: number;
  review_count: number;
  average_price: number;
  description: string;
  ratings: {
    ambience: number;
    food: number;
    service: number;
  };
  isAdvertisement?: boolean;
}

interface FilterState {
  cuisineType?: string;
  neighborhood?: string;
  minRating?: number;
  priceRange?: string;
  filterMode?: string;
}

export default function Home() {
  // Use refs to track loading state without causing re-renders
  const loadingStateRef = useRef({
    initialLoad: true,
    processing: false
  });
  
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isRecommending, setIsRecommending] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({});
  const { isAuthenticated } = useAuth();
  
  // Load data - only runs once per auth change
  useEffect(() => {
    // Prevent duplicate loads
    if (loadingStateRef.current.processing) return;
    loadingStateRef.current.processing = true;
    
    // Start loading
    setIsLoading(true);
    
    // Determine data to load
    const filterMode = isAuthenticated ? 'discover-new-taste' : 'popular';
    const isInitialLoad = loadingStateRef.current.initialLoad;
    const loadTime = 2000;  // Set to 2 seconds for all recommendations
    
    if (isAuthenticated) {
      setIsRecommending(true);
    }
    
    // Use single timeout for loading
    setTimeout(() => {
      try {
        // Select data source based on auth state and filter mode
        let baseData = [];
        
        if (isAuthenticated) {
          // For authenticated users, start with "discover-new-taste" by default
          baseData = [...randomRestaurants];
        } else {
          // For non-authenticated users, start with popular restaurants
          baseData = [...topRestaurants];
        }
        
        // Add advertisement at top
        const fullData = [advertisementRestaurant, ...baseData];
        
        // Update restaurant data synchronously
        setFilters({ filterMode });
        setRestaurants(fullData);
        setFilteredRestaurants(fullData); 
        setIsRecommending(false);
        setIsLoading(false);
        
        // Mark as loaded
        loadingStateRef.current.initialLoad = false;
      } catch (error) {
        console.error("Error loading data:", error);
        setIsLoading(false);
      } finally {
        loadingStateRef.current.processing = false;
      }
    }, loadTime);
  }, [isAuthenticated]);
  
  // Handle search
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (!value.trim()) {
      // Reset to full list if search is cleared
      filterRestaurants(restaurants, filters);
      return;
    }
    
    // Apply search filter
    filterRestaurants(restaurants, filters, value);
  }, [restaurants, filters]);
  
  // Apply filters function
  const applyFilters = useCallback((filterState: FilterState) => {
    // Skip if processing
    if (loadingStateRef.current.processing) return;
    loadingStateRef.current.processing = true;
    
    setIsLoading(true);
    setFilters(filterState);
    
    setTimeout(() => {
      try {
        // Get base dataset based on filter mode
        let sourceData: Restaurant[] = [];
        
        if (!isAuthenticated) {
          // Non-authenticated users
          if (filterState.filterMode === 'popular') {
            sourceData = [...topRestaurants];
          } else if (filterState.filterMode === 'try-something-new') {
            sourceData = [...tryNewRestaurants]; // Use the new unique dataset
          } else {
            sourceData = [...topRestaurants]; // Default
          }
        } else {
          // Authenticated users
          if (filterState.filterMode === 'discover-new-taste') {
            sourceData = [...randomRestaurants];
          } else if (filterState.filterMode === 'seasonal') {
            sourceData = [...seasonalRestaurants];
          } else {
            sourceData = [...personalizedRecommendations]; // Default
          }
        }
        
        // Create new restaurant list with advertisement
        const newRestaurants = [advertisementRestaurant, ...sourceData];
        setRestaurants(newRestaurants);
        
        // Filter the results
        filterRestaurants(newRestaurants, filterState, searchTerm);
      } catch (error) {
        console.error("Error applying filters:", error);
      } finally {
        setIsLoading(false);
        loadingStateRef.current.processing = false;
      }
    }, 2000); // Set to 2 seconds for all recommendations
  }, [isAuthenticated, searchTerm]);
  
  // Helper function to filter restaurants
  const filterRestaurants = useCallback((
    restaurantList: Restaurant[], 
    filterState: FilterState, 
    search: string = ''
  ) => {
    // Filter the list
    const filtered = restaurantList.filter(restaurant => {
      // Always keep advertisement
      if ('isAdvertisement' in restaurant && restaurant.isAdvertisement) {
        return true;
      }
      
      // Apply specific filters
      if (filterState.cuisineType && restaurant.cuisine_type !== filterState.cuisineType) {
        return false;
      }
      
      if (filterState.neighborhood && restaurant.neighborhood !== filterState.neighborhood) {
        return false;
      }
      
      if (filterState.minRating && restaurant.rating < filterState.minRating) {
        return false;
      }
      
      if (filterState.priceRange && restaurant.price_range !== filterState.priceRange) {
        return false;
      }
      
      // Apply search term if provided
      if (search.trim()) {
        return restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
               restaurant.categories.some(cat => cat.toLowerCase().includes(search.toLowerCase()));
      }
      
      return true;
    });
    
    setFilteredRestaurants(filtered);
  }, []);
  
  // Page title based on filter mode
  const renderPageTitle = useCallback(() => {
    if (isAuthenticated) {
      // For authenticated users
      if (filters.filterMode === 'discover-new-taste') {
        return "Discover new tastes and experiences";
      } else if (filters.filterMode === 'seasonal') {
        return "Seasonal recommendations just for you";
      } else {
        return "Restaurants based on your past experiences";
      }
    } else {
      // For non-authenticated users
      if (filters.filterMode === 'try-something-new') {
        return "Try something new in New York";
      } else {
        return "Popular restaurants in New York";
      }
    }
  }, [isAuthenticated, filters.filterMode]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-2 text-[#333] tracking-tight pt-24">{renderPageTitle()}</h1>
        {isAuthenticated && (
          <p className="text-gray-600 mb-8">Based on your past visits and preferences</p>
        )}
        
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search restaurants or cuisines..."
                className="w-full px-10 py-3 border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006B5A] shadow-sm transition-all duration-200 text-black placeholder-gray-500"
                value={searchTerm}
                onChange={handleSearch}
                disabled={isLoading}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#006B5A]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          
          <div className="z-30 relative">
            <Filters onFilterChange={applyFilters} />
          </div>
        </div>
        
        {/* Main Content */}
        <div className="relative">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 border-4 border-[#006B5A] border-t-transparent rounded-full animate-spin mb-4"></div>
              {isRecommending ? (
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Finding the perfect restaurants for you...</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Our recommendation engine is analyzing your preferences and finding the best matches in New York.
                  </p>
                </div>
              ) : (
                <p className="text-lg text-gray-700">Loading restaurants...</p>
              )}
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Restaurant list */}
              <div className="lg:w-3/5">
                {filteredRestaurants.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900">No restaurants found</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredRestaurants.map((restaurant) => (
                      <RestaurantCard 
                        key={restaurant.id} 
                        restaurant={restaurant} 
                        isAdvertisement={!!restaurant.isAdvertisement} 
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Map */}
              <div className="lg:w-2/5 h-[calc(100vh-220px)] sticky top-28 overflow-hidden shadow-lg rounded-xl">
                <RestaurantMap restaurants={filteredRestaurants} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
