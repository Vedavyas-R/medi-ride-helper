
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";

interface MapProps {
  isAnimated?: boolean;
  showRoute?: boolean;
}

const Map = ({ isAnimated = false, showRoute = false }: MapProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="w-full h-[300px] md:h-[400px] overflow-hidden relative border border-border">
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
          
          {/* User location */}
          <div className="absolute bottom-[30%] left-[25%] flex flex-col items-center">
            <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div className="text-xs mt-1 font-medium">Your location</div>
          </div>
          
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
    </Card>
  );
};

export default Map;
