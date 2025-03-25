
import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation, Crosshair } from "lucide-react";

interface Coordinates {
  lat: number;
  lng: number;
}

interface MapProps {
  isAnimated?: boolean;
  showRoute?: boolean;
  isSelectable?: boolean;
  onLocationSelect?: (lat: number, lng: number, address: string) => void;
  initialLocation?: Coordinates;
}

const Map = ({ 
  isAnimated = false, 
  showRoute = false, 
  isSelectable = false,
  onLocationSelect,
  initialLocation
}: MapProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Coordinates | null>(initialLocation || null);
  const [isMarkerDraggable, setIsMarkerDraggable] = useState(false);
  
  // Mock coordinates for demonstration
  const defaultLocation = { lat: 37.7749, lng: -122.4194 }; // San Francisco
  const hospitalLocation = { lat: 37.7895, lng: -122.3982 }; // Example hospital location
  
  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (initialLocation) {
      setSelectedLocation(initialLocation);
    }
  }, [initialLocation]);

  const handleMapClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelectable || !onLocationSelect) return;
    
    // Get click position relative to the map container
    const mapContainer = event.currentTarget;
    const rect = mapContainer.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert to lat/lng (simplified for demonstration)
    // In a real app, this would use the map API's projection methods
    const containerWidth = rect.width;
    const containerHeight = rect.height;
    
    // Create a small random variation to simulate different click positions
    const latVariation = (Math.random() * 0.01) - 0.005;
    const lngVariation = (Math.random() * 0.01) - 0.005;
    
    // Map the click position to coordinates
    // This is a very simplified mapping just for demonstration
    const lat = defaultLocation.lat + ((containerHeight / 2 - y) / containerHeight * 0.05) + latVariation;
    const lng = defaultLocation.lng + ((x - containerWidth / 2) / containerWidth * 0.05) + lngVariation;
    
    // Update selected location
    setSelectedLocation({ lat, lng });
    
    // Generate a mock address based on the coordinates
    const mockAddress = `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    
    // Call the callback with the selected location
    onLocationSelect(lat, lng, mockAddress);
    
    // Make marker draggable after initial selection
    setIsMarkerDraggable(true);
  }, [isSelectable, onLocationSelect]);

  return (
    <Card 
      className={`w-full h-[300px] md:h-[400px] overflow-hidden relative border border-border ${isSelectable ? 'cursor-crosshair' : ''}`}
      onClick={handleMapClick}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-secondary animate-pulse flex items-center justify-center">
          <div className="text-muted-foreground">Loading map...</div>
        </div>
      )}
      
      <div className={`w-full h-full bg-[#e8eef7] relative ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
        {/* Simplified map visualization */}
        <div className="absolute inset-0 p-4">
          {/* Roads */}
          <div className="absolute top-1/2 left-0 right-0 h-2 bg-[#d3d8e2]"></div>
          <div className="absolute left-1/3 top-0 bottom-0 w-2 bg-[#d3d8e2]"></div>
          <div className="absolute left-2/3 top-0 bottom-0 w-2 bg-[#d3d8e2]"></div>
          
          {/* Buildings */}
          <div className="absolute top-[20%] left-[20%] w-16 h-16 bg-[#c4cad7] rounded-sm"></div>
          <div className="absolute top-[60%] left-[15%] w-12 h-20 bg-[#c4cad7] rounded-sm"></div>
          <div className="absolute top-[30%] left-[60%] w-20 h-14 bg-[#c4cad7] rounded-sm"></div>
          <div className="absolute top-[70%] left-[70%] w-16 h-16 bg-[#c4cad7] rounded-sm"></div>
          
          {/* Hospital icon */}
          <div className="absolute top-[25%] right-[15%] flex flex-col items-center">
            <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center border-2 border-red-400">
              <span className="text-red-500 text-xl font-bold">H</span>
            </div>
            <div className="text-xs mt-1 font-medium">Hospital</div>
          </div>
          
          {/* User location - show when not in selection mode */}
          {!isSelectable && (
            <div className="absolute bottom-[30%] left-[25%] flex flex-col items-center">
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div className="text-xs mt-1 font-medium">Your location</div>
            </div>
          )}
          
          {/* Selected location marker - show in selection mode */}
          {isSelectable && selectedLocation && (
            <div 
              className="absolute flex flex-col items-center z-20"
              style={{
                top: `${50 - (selectedLocation.lat - defaultLocation.lat) * 1000}%`,
                left: `${50 + (selectedLocation.lng - defaultLocation.lng) * 1000}%`,
              }}
            >
              <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center animate-pulse shadow-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div className="text-xs mt-1 font-semibold bg-white px-2 py-1 rounded shadow-sm">
                Selected Location
              </div>
            </div>
          )}
          
          {/* Crosshair in the center when in selection mode */}
          {isSelectable && !selectedLocation && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary opacity-70">
              <Crosshair className="h-10 w-10" />
            </div>
          )}
          
          {/* Ambulance (when showing route) */}
          {showRoute && (
            <>
              {/* Route line */}
              <div className="absolute h-1 bg-primary z-10" style={{
                top: '45%',
                left: '28%',
                width: '45%',
                transform: 'rotate(-10deg)',
                transformOrigin: 'left center'
              }}></div>
              
              {/* Ambulance icon */}
              <div 
                className={`absolute flex flex-col items-center z-20 ${isAnimated ? 'transition-all duration-[3000ms]' : ''}`}
                style={isAnimated ? {
                  top: '40%',
                  left: isLoaded ? '60%' : '28%',
                } : {
                  top: '40%',
                  left: '45%',
                }}
              >
                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-md">
                  <Navigation className="h-6 w-6 text-primary" />
                </div>
                <div className="text-xs mt-1 font-semibold bg-white px-2 py-1 rounded shadow-sm">Ambulance</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Selection instructions overlay */}
      {isSelectable && !selectedLocation && isLoaded && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="bg-white/80 px-4 py-2 rounded-md shadow text-sm font-medium">
            Tap anywhere on the map to set your location
          </div>
        </div>
      )}
    </Card>
  );
};

export default Map;
