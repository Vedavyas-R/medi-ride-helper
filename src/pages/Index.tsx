
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Ambulance, Clock, Shield, Stethoscope, ArrowRight } from "lucide-react";
import { useApp } from "@/context/AppContext";

const Index = () => {
  const { currentBooking } = useApp();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Hero section */}
      <section className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 z-10"></div>
          
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1629494994529-5ee3f4d14e42?q=80&w=1200')] bg-cover bg-center"></div>
          
          <div className="relative z-20 py-16 md:py-24 px-6 md:px-12 text-white">
            <div className="max-w-2xl animate-slide-in">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Emergency Medical Transportation at Your Fingertips
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-8">
                MediRide provides fast, reliable ambulance services when you need them most. Our professional medical team is available 24/7.
              </p>
              
              {currentBooking && currentBooking.status !== "cancelled" && currentBooking.status !== "completed" ? (
                <Link to="/tracking">
                  <Button size="lg" variant="secondary" className="group">
                    Track Your Ambulance 
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              ) : (
                <Link to="/booking">
                  <Button size="lg" variant="secondary" className="group">
                    Book an Ambulance Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose MediRide</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Clock className="h-10 w-10 text-primary" />,
              title: "Rapid Response",
              description: "Our ambulances arrive quickly in emergency situations, with an average response time of just 8 minutes."
            },
            {
              icon: <Stethoscope className="h-10 w-10 text-primary" />,
              title: "Professional Care",
              description: "All our ambulances are staffed with certified paramedics and EMTs trained to handle any medical emergency."
            },
            {
              icon: <Shield className="h-10 w-10 text-primary" />,
              title: "Advanced Equipment",
              description: "Our fleet is equipped with the latest medical technology to provide critical care during transport."
            }
          ].map((feature, index) => (
            <Card key={index} className="border border-border hover:shadow-md transition-all">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section className="py-12 mb-8">
        <div className="bg-secondary rounded-xl p-8 md:p-12 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Need Emergency Medical Transport?</h2>
            <p className="text-muted-foreground mb-6">
              Don't wait until it's too late. Book an ambulance quickly and easily with MediRide.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/booking">
                <Button size="lg" className="w-full sm:w-auto">
                  <Ambulance className="mr-2 h-5 w-5" />
                  Book an Ambulance
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
