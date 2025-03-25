
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useApp } from "@/context/AppContext";
import { Phone, Clock, MapPin, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const getStatusInfo = (status: string) => {
  switch (status) {
    case "confirmed":
      return {
        label: "Confirmed",
        color: "bg-blue-500",
        icon: <Clock className="h-5 w-5" />,
        message: "Your ambulance is confirmed and being dispatched",
        progress: 25,
      };
    case "en-route":
      return {
        label: "En Route",
        color: "bg-yellow-500",
        icon: <MapPin className="h-5 w-5" />,
        message: "Your ambulance is on the way",
        progress: 50,
      };
    case "arrived":
      return {
        label: "Arrived",
        color: "bg-green-500",
        icon: <CheckCircle2 className="h-5 w-5" />,
        message: "Your ambulance has arrived at your location",
        progress: 75,
      };
    case "completed":
      return {
        label: "Completed",
        color: "bg-green-600",
        icon: <CheckCircle2 className="h-5 w-5" />,
        message: "Your journey has been completed",
        progress: 100,
      };
    case "cancelled":
      return {
        label: "Cancelled",
        color: "bg-red-500",
        icon: <XCircle className="h-5 w-5" />,
        message: "This booking has been cancelled",
        progress: 100,
      };
    default:
      return {
        label: "Processing",
        color: "bg-gray-500",
        icon: <Clock className="h-5 w-5" />,
        message: "Processing your request",
        progress: 10,
      };
  }
};

const BookingStatus = () => {
  const { currentBooking, cancelBooking } = useApp();
  const navigate = useNavigate();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  
  useEffect(() => {
    if (!currentBooking) {
      navigate("/booking");
      return;
    }
    
    // Set initial countdown from estimatedArrival
    if (currentBooking.estimatedArrival) {
      setCountdown(currentBooking.estimatedArrival * 60); // Convert minutes to seconds
    }
    
    // Mock status updates
    const statusUpdates = [
      { status: "en-route", delay: 10000 },
      { status: "arrived", delay: 25000 },
      { status: "completed", delay: 40000 }
    ];
    
    // Only set up updates if not cancelled or completed
    if (currentBooking.status !== "cancelled" && currentBooking.status !== "completed") {
      const timers = statusUpdates.map(update => {
        return setTimeout(() => {
          if (currentBooking && currentBooking.status !== "cancelled") {
            // Simulate status update (in a real app, this would come from backend)
            useApp().setCurrentBooking({
              ...currentBooking,
              status: update.status as any
            });
          }
        }, update.delay);
      });
      
      return () => timers.forEach(timer => clearTimeout(timer));
    }
  }, [currentBooking, navigate]);
  
  // Countdown timer
  useEffect(() => {
    if (countdown === null || countdown <= 0) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => (prev !== null && prev > 0) ? prev - 1 : null);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [countdown]);
  
  // Format countdown for display
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleCancelBooking = async () => {
    if (!currentBooking) return;
    
    const success = await cancelBooking(currentBooking.id || "");
    if (success) {
      setCancelDialogOpen(false);
    }
  };

  if (!currentBooking) {
    return null;
  }
  
  const statusInfo = getStatusInfo(currentBooking.status);
  const canCancel = ["confirmed", "en-route"].includes(currentBooking.status);
  
  return (
    <Card className="w-full border border-border">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">Booking #{currentBooking.id?.slice(-4)}</CardTitle>
            <CardDescription>
              {new Date(currentBooking.createdAt || new Date()).toLocaleString()}
            </CardDescription>
          </div>
          <Badge 
            className={`${statusInfo.color} hover:${statusInfo.color} text-white`}
          >
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">Status</div>
            <div className="font-medium flex items-center gap-1">
              {statusInfo.icon} {statusInfo.message}
            </div>
          </div>
          
          <Progress value={statusInfo.progress} className="h-2" />
        </div>
        
        {currentBooking.status !== "cancelled" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* ETA Information */}
            <div className="flex items-center gap-3 p-3 rounded-md bg-secondary">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-medium">Estimated Arrival</div>
                <div className="text-xl font-bold">
                  {countdown !== null ? formatTime(countdown) : "--:--"}
                </div>
              </div>
            </div>
            
            {/* Driver Information */}
            {currentBooking.driverInfo && (
              <div className="flex items-center gap-3 p-3 rounded-md bg-secondary">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium">{currentBooking.driverInfo.name}</div>
                  <div className="text-muted-foreground">{currentBooking.driverInfo.contactNumber}</div>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="space-y-3 mt-4">
          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">Patient</div>
            <div className="font-medium">{currentBooking.patientName}</div>
          </div>
          
          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">Ambulance Type</div>
            <div className="font-medium">{currentBooking.ambulanceType}</div>
          </div>
          
          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">Pickup Location</div>
            <div className="font-medium">{currentBooking.pickupLocation.address}</div>
          </div>
          
          {currentBooking.destination && (
            <div className="flex justify-between">
              <div className="text-sm text-muted-foreground">Destination</div>
              <div className="font-medium">{currentBooking.destination.address}</div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        {canCancel ? (
          <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <AlertCircle className="h-4 w-4 mr-2" />
                Cancel Booking
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancel Ambulance Booking</DialogTitle>
                <DialogDescription>
                  Are you sure you want to cancel this ambulance booking? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                  No, Keep Booking
                </Button>
                <Button variant="destructive" onClick={handleCancelBooking}>
                  Yes, Cancel Booking
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Button 
            variant="default" 
            className="w-full" 
            onClick={() => navigate("/booking")}
          >
            Book Another Ambulance
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BookingStatus;
