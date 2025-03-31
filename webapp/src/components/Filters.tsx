import React, { Fragment, useState, useEffect, useCallback, memo } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { useAuth } from '@/context/AuthContext';

// Filter modes for non-logged in users
const nonAuthFilterModes = [
  { id: 'popular', name: 'Popular' },
  { id: 'try-something-new', name: 'Try Something New' },
];

// Filter modes for logged in users
const authFilterModes = [
  { id: 'discover-new-taste', name: 'Discover New Taste' },
  { id: 'past-experience', name: 'Based on Past Experience' },
  { id: 'seasonal', name: 'Seasonal For You' },
];

// NYC neighborhoods 
const neighborhoods = [
  { id: 'all', name: 'All Neighborhoods' },
  { id: 'greenwich-village', name: 'Greenwich Village' },
  { id: 'west-village', name: 'West Village' },
  { id: 'soho', name: 'SoHo' },
  { id: 'lower-east-side', name: 'Lower East Side' },
  { id: 'east-village', name: 'East Village' },
  { id: 'flatiron', name: 'Flatiron District' },
  { id: 'midtown', name: 'Midtown' },
  { id: 'williamsburg', name: 'Williamsburg' },
  { id: 'upper-east-side', name: 'Upper East Side' },
  { id: 'upper-west-side', name: 'Upper West Side' },
  { id: 'tribeca', name: 'Tribeca' },
  { id: 'chelsea', name: 'Chelsea' },
];

// Cuisine types
const cuisineTypes = [
  { id: 'all', name: 'All Cuisines' },
  { id: 'American', name: 'American' },
  { id: 'Italian', name: 'Italian' },
  { id: 'Japanese', name: 'Japanese' },
  { id: 'Chinese', name: 'Chinese' },
  { id: 'French', name: 'French' },
  { id: 'Steakhouse', name: 'Steakhouse' },
  { id: 'Pizza', name: 'Pizza' },
  { id: 'Seafood', name: 'Seafood' },
  { id: 'Deli', name: 'Deli' },
  { id: 'Jewish', name: 'Jewish' },
  { id: 'Contemporary', name: 'Contemporary' },
];

// Ratings
const ratings = [
  { id: 'all', name: 'Any Rating', value: 0 },
  { id: '8plus', name: '8.0+', value: 8 },
  { id: '9plus', name: '9.0+', value: 9 },
];

// Price ranges
const priceRanges = [
  { id: 'all', name: 'Any Price' },
  { id: '$', name: '$' },
  { id: '$$', name: '$$' },
  { id: '$$$', name: '$$$' },
  { id: '$$$$', name: '$$$$' },
];

interface FilterState {
  filterMode?: string;
  neighborhood?: string;
  cuisineType?: string;
  minRating?: number;
  priceRange?: string;
}

interface FiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

// Custom Dropdown component styled like TheFork
const CustomDropdown = memo(({ 
  label, 
  options, 
  selected, 
  onChange,
  disabled = false
}: { 
  label: string;
  options: any[];
  selected: any;
  onChange: (value: any) => void;
  disabled?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (option: any) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="text-sm font-medium text-gray-700 mb-1">
        {label}
      </div>
      <button
        type="button"
        onClick={toggleDropdown}
        className={`flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm ${
          disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'
        }`}
        disabled={disabled}
      >
        <span className="text-left truncate">{selected?.name || 'Select'}</span>
        <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 overflow-auto bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {options.map((option) => (
              <div
                key={option.id}
                className={`${
                  selected?.id === option.id ? 'bg-gray-100 text-[#006B5A]' : 'text-gray-800'
                } cursor-pointer select-none relative py-2.5 pl-10 pr-4 hover:bg-gray-50`}
                onClick={() => handleSelect(option)}
              >
                <span className={`block truncate ${selected?.id === option.id ? 'font-medium' : 'font-normal'}`}>
                  {option.name}
                </span>
                {selected?.id === option.id && (
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#006B5A]">
                    <CheckIcon className="w-5 h-5" aria-hidden="true" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

CustomDropdown.displayName = 'CustomDropdown';

// Component for filtering
export default function Filters({ onFilterChange }: FiltersProps) {
  const { isAuthenticated } = useAuth();
  const filterModes = isAuthenticated ? authFilterModes : nonAuthFilterModes;
  
  // Get the first filter mode based on authentication status
  const initialFilterMode = filterModes[0];
  
  const [selectedFilterMode, setSelectedFilterMode] = useState(initialFilterMode);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(neighborhoods[0]);
  const [selectedCuisine, setSelectedCuisine] = useState(cuisineTypes[0]);
  const [selectedRating, setSelectedRating] = useState(ratings[0]);
  const [selectedPrice, setSelectedPrice] = useState(priceRanges[0]);
  const [hasMounted, setHasMounted] = useState(false);

  // Mark component as mounted to prevent useEffect running on first render
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Reset selected filter mode when auth status changes
  useEffect(() => {
    if (hasMounted) {
      const newFilterMode = isAuthenticated ? authFilterModes[0] : nonAuthFilterModes[0];
      setSelectedFilterMode(newFilterMode);
    }
  }, [isAuthenticated, hasMounted]);

  // Call applyFilters when selections change, but only after mounting
  // This is critical to prevent circular updates
  useEffect(() => {
    // Only trigger filter changes if the component has mounted
    // and isn't in the initial render
    if (hasMounted) {
      // Use debounce-like behavior to prevent too many filter changes
      const timerId = setTimeout(() => {
        const filters: FilterState = {
          filterMode: selectedFilterMode.id
        };
        
        // Always include additional filters
        if (selectedCuisine.id !== 'all') filters.cuisineType = selectedCuisine.id;
        if (selectedNeighborhood.id !== 'all') filters.neighborhood = selectedNeighborhood.name;
        if (selectedRating.id !== 'all') filters.minRating = selectedRating.value;
        if (selectedPrice.id !== 'all') filters.priceRange = selectedPrice.id;
        
        onFilterChange(filters);
      }, 300); // Delay to batch rapid changes
      
      return () => clearTimeout(timerId);
    }
  }, [
    hasMounted,
    selectedFilterMode, 
    selectedNeighborhood, 
    selectedCuisine, 
    selectedRating, 
    selectedPrice,
    onFilterChange
  ]);

  // Handle filter mode change
  const handleFilterModeChange = useCallback((mode: any) => {
    setSelectedFilterMode(mode);
  }, []);

  return (
    <div className="mb-8">
      {/* Main filter buttons based on auth status */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {filterModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleFilterModeChange(mode)}
              className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                selectedFilterMode.id === mode.id
                  ? 'bg-[#006B5A] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {mode.name}
            </button>
          ))}
        </div>
      </div>

      {/* Always show filter options */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm mb-4">
        {/* Neighborhood selector */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Neighborhood
          </label>
          <select
            className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#006B5A] focus:border-[#006B5A] sm:text-sm"
            value={selectedNeighborhood.id}
            onChange={(e) => setSelectedNeighborhood(neighborhoods.find(n => n.id === e.target.value) || neighborhoods[0])}
          >
            {neighborhoods.map((neighborhood) => (
              <option key={neighborhood.id} value={neighborhood.id}>
                {neighborhood.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Cuisine selector */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cuisine
          </label>
          <select
            className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#006B5A] focus:border-[#006B5A] sm:text-sm"
            value={selectedCuisine.id}
            onChange={(e) => setSelectedCuisine(cuisineTypes.find(c => c.id === e.target.value) || cuisineTypes[0])}
          >
            {cuisineTypes.map((cuisine) => (
              <option key={cuisine.id} value={cuisine.id}>
                {cuisine.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Rating selector */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rating
          </label>
          <select
            className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#006B5A] focus:border-[#006B5A] sm:text-sm"
            value={selectedRating.id}
            onChange={(e) => setSelectedRating(ratings.find(r => r.id === e.target.value) || ratings[0])}
          >
            {ratings.map((rating) => (
              <option key={rating.id} value={rating.id}>
                {rating.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Price selector */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <select
            className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#006B5A] focus:border-[#006B5A] sm:text-sm"
            value={selectedPrice.id}
            onChange={(e) => setSelectedPrice(priceRanges.find(p => p.id === e.target.value) || priceRanges[0])}
          >
            {priceRanges.map((price) => (
              <option key={price.id} value={price.id}>
                {price.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
} 