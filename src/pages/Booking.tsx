
import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import BookingForm from "@/components/BookingForm";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

const Booking = () => {
  const { currentBooking } = useApp();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // If there's an active booking, redirect to tracking
  useEffect(() => {
    console.log("Booking page loaded, checking current booking:", currentBooking);
    
    if (currentBooking && 
        currentBooking.status !== "cancelled" && 
        currentBooking.status !== "completed") {
      navigate("/tracking");
    }
    
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [currentBooking, navigate]);

  return (
    <div className={`container mx-auto px-4 py-8 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-3xl mx-auto mb-8">
        <h1 className="text-3xl font-bold mb-2">Book an Ambulance</h1>
        <p className="text-muted-foreground">
          Fill out the form below to request immediate medical transportation
        </p>
        
        <Alert variant="destructive" className="mt-6 mb-8 bg-destructive/10 border-destructive/20 text-destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Emergency Warning</AlertTitle>
          <AlertDescription>
            If you're experiencing a life-threatening emergency, please also call 911 immediately.
          </AlertDescription>
        </Alert>
        
        <BookingForm />
      </div>
    </div>
  );
};

export default Booking;
