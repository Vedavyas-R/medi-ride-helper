
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Ambulance, AlertTriangle, Stethoscope, MapPin, RotateCw, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Map from "./Map";

const ambulanceTypes = [
  {
    id: "Basic",
    name: "Basic Ambulance",
    description: "For non-critical emergencies",
    icon: <Ambulance className="h-5 w-5" />,
    estimatedTime: "10-15 min",
    cost: "$50-100"
  },
  {
    id: "Advanced",
    name: "Advanced Life Support",
    description: "For serious medical emergencies",
    icon: <AlertTriangle className="h-5 w-5" />,
    estimatedTime: "8-12 min",
    cost: "$150-250"
  },
  {
    id: "Specialized",
    name: "Specialized Care",
    description: "For critical conditions requiring specialist equipment",
    icon: <Stethoscope className="h-5 w-5" />,
    estimatedTime: "5-10 min",
    cost: "$300-450"
  }
];

const BookingForm = () => {
  const navigate = useNavigate();
  const { user, createBooking, isLoading } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [mapInteractionComplete, setMapInteractionComplete] = useState(false);
  
  const [formData, setFormData] = useState({
    patientName: user?.name || "",
    contactNumber: user?.phone || "",
    pickupLocation: "",
    pickupCoordinates: {
      lat: null as number | null,
      lng: null as number | null
    },
    destination: "",
    ambulanceType: "Basic",
    medicalNotes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmbulanceTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, ambulanceType: value }));
  };

  const handleMapLocationSelect = (lat: number, lng: number, address: string) => {
    setFormData(prev => ({
      ...prev,
      pickupCoordinates: { lat, lng },
      pickupLocation: address || prev.pickupLocation
    }));
    setMapInteractionComplete(true);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Get address from coordinates (simplified for demo)
        const mockAddress = `Location at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        
        setFormData(prev => ({
          ...prev,
          pickupCoordinates: { lat: latitude, lng: longitude },
          pickupLocation: mockAddress
        }));
        
        setMapInteractionComplete(true);
        setIsGettingLocation(false);
        toast.success("Current location detected");
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Failed to get your location. Please select manually on the map.");
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const nextStep = () => {
    // Validate current step
    if (currentStep === 1) {
      if (!formData.patientName || !formData.contactNumber) {
        toast.error("Please fill all required fields in patient information");
        return;
      }
    }
    
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation
    if (!formData.patientName || !formData.contactNumber || !formData.pickupLocation) {
      toast.error("Please fill all required fields");
      return;
    }
    
    if (!formData.pickupCoordinates.lat || !formData.pickupCoordinates.lng) {
      toast.error("Please select your exact pickup location on the map");
      return;
    }
    
    try {
      // Convert form data to booking details format
      const bookingDetails = {
        patientName: formData.patientName,
        contactNumber: formData.contactNumber,
        pickupLocation: { 
          address: formData.pickupLocation,
          coordinates: formData.pickupCoordinates 
        },
        destination: formData.destination ? { address: formData.destination } : undefined,
        ambulanceType: formData.ambulanceType as "Basic" | "Advanced" | "Specialized",
        medicalNotes: formData.medicalNotes
      };
      
      await createBooking(bookingDetails);
      navigate("/tracking");
    } catch (error) {
      console.error("Booking error:", error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="border border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Patient Information</CardTitle>
              <CardDescription>
                Please provide details about the patient requiring assistance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name*</Label>
                  <Input
                    id="patientName"
                    name="patientName"
                    placeholder="Full name"
                    value={formData.patientName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number*</Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    placeholder="+1 (123) 456-7890"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="medicalNotes">Medical Information</Label>
                <Textarea
                  id="medicalNotes"
                  name="medicalNotes"
                  placeholder="Describe the medical condition, symptoms, or any relevant medical history"
                  rows={3}
                  value={formData.medicalNotes}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
            <CardFooter className="justify-end border-t bg-muted/10 px-6 py-4">
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
      
      case 2:
        return (
          <Card className="border border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Ambulance Type</CardTitle>
              <CardDescription>
                Select the appropriate ambulance type based on the patient's needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.ambulanceType}
                onValueChange={handleAmbulanceTypeChange}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
              >
                {ambulanceTypes.map((type) => (
                  <div key={type.id} className="relative">
                    <RadioGroupItem
                      value={type.id}
                      id={type.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={type.id}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted/10 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                        {type.icon}
                      </div>
                      <div className="font-medium">{type.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{type.description}</div>
                      <div className="flex w-full justify-between mt-4 text-sm">
                        <span>{type.estimatedTime}</span>
                        <span className="font-medium">{type.cost}</span>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between border-t bg-muted/10 px-6 py-4">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
        
      case 3:
        return (
          <Card className="border border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Pickup Location</CardTitle>
              <CardDescription>
                Pinpoint your exact location on the map or use your device's location services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pickupLocation">Address*</Label>
                <Input
                  id="pickupLocation"
                  name="pickupLocation"
                  placeholder="Street address, city, state"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Exact Location</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="text-xs h-8"
                  >
                    {isGettingLocation ? (
                      <RotateCw className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <MapPin className="h-3 w-3 mr-1" />
                    )}
                    {isGettingLocation ? "Detecting..." : "Use My Location"}
                  </Button>
                </div>
                
                <div className="border rounded-md overflow-hidden h-[300px]">
                  <Map 
                    isSelectable={true}
                    onLocationSelect={handleMapLocationSelect}
                    initialLocation={formData.pickupCoordinates.lat && formData.pickupCoordinates.lng ? 
                      { lat: formData.pickupCoordinates.lat, lng: formData.pickupCoordinates.lng } : 
                      undefined}
                  />
                </div>
                
                <div className="text-sm p-3 bg-secondary/50 rounded border border-border">
                  {mapInteractionComplete ? (
                    <div className="flex items-center text-green-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>Location selected successfully</span>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      Tap on the map to set your exact pickup location
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="destination">Destination Hospital (if known)</Label>
                <Input
                  id="destination"
                  name="destination"
                  placeholder="Hospital or medical facility address"
                  value={formData.destination}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t bg-muted/10 px-6 py-4">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading || !mapInteractionComplete}
                className="min-w-32"
              >
                {isLoading ? "Processing..." : "Request Ambulance"}
              </Button>
            </CardFooter>
          </Card>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} mr-2`}>
              1
            </div>
            <span className={currentStep >= 1 ? 'font-medium' : 'text-muted-foreground'}>Patient Info</span>
          </div>
          <div className="h-0.5 w-8 bg-muted mx-2" />
          <div className="flex items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} mr-2`}>
              2
            </div>
            <span className={currentStep >= 2 ? 'font-medium' : 'text-muted-foreground'}>Ambulance Type</span>
          </div>
          <div className="h-0.5 w-8 bg-muted mx-2" />
          <div className="flex items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} mr-2`}>
              3
            </div>
            <span className={currentStep >= 3 ? 'font-medium' : 'text-muted-foreground'}>Location</span>
          </div>
        </div>
      </div>
      
      <form className="space-y-6">
        {renderStepContent()}
      </form>
    </div>
  );
};

export default BookingForm;
