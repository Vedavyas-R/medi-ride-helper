
import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

// Types for our context
type AmbulanceType = "Basic" | "Advanced" | "Specialized";
type BookingStatus = "idle" | "processing" | "confirmed" | "en-route" | "arrived" | "completed" | "cancelled";

interface LocationType {
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface BookingDetails {
  id?: string;
  userId?: string;
  patientName: string;
  contactNumber: string;
  pickupLocation: LocationType;
  destination?: LocationType;
  ambulanceType: AmbulanceType;
  medicalNotes: string;
  status: BookingStatus;
  createdAt?: Date;
  estimatedArrival?: number; // in minutes
  driverInfo?: {
    name: string;
    contactNumber: string;
    rating: number;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isLoggedIn: boolean;
  bookingHistory?: string[];
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  currentBooking: BookingDetails | null;
  setCurrentBooking: (booking: BookingDetails | null) => void;
  createBooking: (bookingDetails: Partial<BookingDetails>) => Promise<BookingDetails>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
  isLoading: boolean;
}

const defaultContext: AppContextType = {
  user: null,
  setUser: () => {},
  login: async () => false,
  logout: () => {},
  currentBooking: null,
  setCurrentBooking: () => {},
  createBooking: async () => ({ patientName: "", contactNumber: "", pickupLocation: { address: "" }, ambulanceType: "Basic", medicalNotes: "", status: "idle" }),
  cancelBooking: async () => false,
  isLoading: false,
};

const AppContext = createContext<AppContextType>(defaultContext);

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentBooking, setCurrentBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Mock login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email && password) {
        const mockUser: User = {
          id: "user-123",
          name: "John Doe",
          email,
          phone: "+1 (555) 123-4567",
          isLoggedIn: true,
          bookingHistory: []
        };
        
        setUser(mockUser);
        toast.success("Successfully logged in!");
        return true;
      }
      
      throw new Error("Invalid credentials");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    toast.success("Successfully logged out!");
  };

  // Mock booking creation
  const createBooking = async (bookingDetails: Partial<BookingDetails>): Promise<BookingDetails> => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newBooking: BookingDetails = {
        id: `booking-${Date.now()}`,
        userId: user?.id,
        patientName: bookingDetails.patientName || "",
        contactNumber: bookingDetails.contactNumber || "",
        pickupLocation: bookingDetails.pickupLocation || { address: "" },
        destination: bookingDetails.destination,
        ambulanceType: bookingDetails.ambulanceType || "Basic",
        medicalNotes: bookingDetails.medicalNotes || "",
        status: "confirmed",
        createdAt: new Date(),
        estimatedArrival: Math.floor(Math.random() * 10) + 5, // 5-15 minutes
        driverInfo: {
          name: "Driver " + (Math.floor(Math.random() * 5) + 1),
          contactNumber: "+1 (555) " + Math.floor(Math.random() * 900 + 100) + "-" + Math.floor(Math.random() * 9000 + 1000),
          rating: 4 + Math.random()
        }
      };
      
      setCurrentBooking(newBooking);
      toast.success("Ambulance booked successfully!");
      return newBooking;
    } catch (error) {
      toast.error("Failed to book ambulance. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock cancel booking
  const cancelBooking = async (bookingId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (currentBooking && currentBooking.id === bookingId) {
        setCurrentBooking({
          ...currentBooking,
          status: "cancelled"
        });
        
        toast.success("Booking cancelled successfully!");
        // In a real app, after some time, we might want to clear the current booking
        setTimeout(() => setCurrentBooking(null), 5000);
        return true;
      }
      
      throw new Error("Booking not found");
    } catch (error) {
      toast.error("Failed to cancel booking. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        currentBooking,
        setCurrentBooking,
        createBooking,
        cancelBooking,
        isLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
