
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Ambulance, AlertTriangle, Stethoscope } from "lucide-react";
import { toast } from "sonner";

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
  
  const [formData, setFormData] = useState({
    patientName: user?.name || "",
    contactNumber: user?.phone || "",
    pickupLocation: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.patientName || !formData.contactNumber || !formData.pickupLocation) {
      toast.error("Please fill all required fields");
      return;
    }
    
    try {
      // Convert form data to booking details format
      const bookingDetails = {
        patientName: formData.patientName,
        contactNumber: formData.contactNumber,
        pickupLocation: { address: formData.pickupLocation },
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

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
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
              <Label htmlFor="pickupLocation">Pickup Location*</Label>
              <Input
                id="pickupLocation"
                name="pickupLocation"
                placeholder="Street address, city, state"
                value={formData.pickupLocation}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="destination">Destination (if known)</Label>
              <Input
                id="destination"
                name="destination"
                placeholder="Hospital or medical facility address"
                value={formData.destination}
                onChange={handleChange}
              />
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
        </Card>

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
          <CardFooter className="border-t bg-muted/10 px-6 py-4">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Request Ambulance"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default BookingForm;
