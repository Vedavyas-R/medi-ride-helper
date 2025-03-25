
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import BookingStatus from "@/components/BookingStatus";
import Map from "@/components/Map";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Tracking = () => {
  const { currentBooking } = useApp();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Redirect if no active booking
  useEffect(() => {
    if (!currentBooking) {
      navigate("/booking");
      return;
    }
    
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [currentBooking, navigate]);

  if (!currentBooking) {
    return null;
  }

  return (
    <div className={`container mx-auto px-4 py-8 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="mb-6 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Track Your Ambulance</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <BookingStatus />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-medium">Real-time Location</h2>
          <Map 
            isAnimated={currentBooking.status !== "cancelled"} 
            showRoute={currentBooking.status !== "cancelled"} 
          />
          
          <div className="bg-secondary p-4 rounded-md text-sm">
            <p className="mb-2 font-medium">Note:</p>
            <p>The location shown is approximate. In a real application, this would be using real-time GPS tracking.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracking;
