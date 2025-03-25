
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Clock, LogOut, User } from "lucide-react";

const mockBookingHistory = [
  {
    id: "booking-001",
    date: "2023-10-15",
    time: "14:30",
    patientName: "John Doe",
    pickupLocation: "123 Main St, New York, NY",
    destination: "Mount Sinai Hospital",
    ambulanceType: "Advanced",
    status: "completed"
  },
  {
    id: "booking-002",
    date: "2023-11-05",
    time: "09:15",
    patientName: "John Doe",
    pickupLocation: "123 Main St, New York, NY",
    destination: "NYU Langone Medical Center",
    ambulanceType: "Basic",
    status: "cancelled"
  }
];

const Profile = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="outline" className="text-green-500 border-green-200 bg-green-50">Completed</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">Cancelled</Badge>;
      default:
        return <Badge variant="outline" className="text-yellow-500 border-yellow-200 bg-yellow-50">In Progress</Badge>;
    }
  };

  return (
    <div className={`container mx-auto px-4 py-8 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="border border-border lg:col-span-1">
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm">
                <div className="text-muted-foreground mb-1">Phone Number</div>
                <div>{user.phone}</div>
              </div>
              <div className="text-sm">
                <div className="text-muted-foreground mb-1">Member Since</div>
                <div>October 2023</div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </CardFooter>
          </Card>
          
          {/* Booking History */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="history">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="history">Booking History</TabsTrigger>
                <TabsTrigger value="settings">Account Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="history" className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Your Past Bookings</h2>
                
                {mockBookingHistory.length > 0 ? (
                  <div className="space-y-4">
                    {mockBookingHistory.map((booking) => (
                      <Card key={booking.id} className="border border-border">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">Booking #{booking.id.slice(-3)}</CardTitle>
                              <CardDescription>{booking.date} at {booking.time}</CardDescription>
                            </div>
                            {getStatusLabel(booking.status)}
                          </div>
                        </CardHeader>
                        <CardContent className="pb-4">
                          <div className="grid grid-cols-1 gap-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Patient:</span>
                              <span>{booking.patientName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">From:</span>
                              <span className="text-right">{booking.pickupLocation}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">To:</span>
                              <span className="text-right">{booking.destination}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Ambulance Type:</span>
                              <span>{booking.ambulanceType}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0 flex justify-end">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-6 text-center">
                      <p className="text-muted-foreground">You don't have any booking history yet.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="py-4">
                    <p className="text-muted-foreground text-center py-8">
                      Account settings functionality will be implemented in a future update.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
