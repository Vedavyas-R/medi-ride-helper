
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Ambulance, 
  MapPin, 
  User, 
  LogOut, 
  LogIn,
  Menu,
  X
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const { user, logout } = useApp();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
    { path: "/booking", label: "Book", icon: <Ambulance className="h-5 w-5" /> },
    { path: "/tracking", label: "Track", icon: <MapPin className="h-5 w-5" /> },
    { path: "/profile", label: "Profile", icon: <User className="h-5 w-5" /> },
  ];

  const isActiveRoute = (path: string) => location.pathname === path;

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md shadow-sm"
          : "bg-background"
      }`}
    >
      <div className="container flex h-16 items-center justify-between py-4">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Ambulance className="h-6 w-6 text-primary" />
          <span className="font-semibold text-xl">MediRide</span>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActiveRoute(item.path)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Auth buttons (desktop) */}
        {!isMobile && (
          <div className="flex items-center gap-2">
            {user ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="flex items-center gap-1"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            ) : (
              <Button asChild variant="default" size="sm">
                <Link to="/login" className="flex items-center gap-1">
                  <LogIn className="h-4 w-4 mr-1" />
                  Login
                </Link>
              </Button>
            )}
          </div>
        )}

        {/* Mobile menu toggle */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        )}
      </div>

      {/* Mobile menu */}
      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur-sm animate-fade-in">
          <nav className="container flex flex-col gap-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 text-lg font-medium rounded-md transition-colors ${
                  isActiveRoute(item.path)
                    ? "bg-secondary text-primary"
                    : "hover:bg-secondary/50"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            
            <div className="mt-4 border-t pt-4">
              {user ? (
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </Button>
              ) : (
                <Button 
                  asChild 
                  size="lg"
                  className="w-full flex items-center justify-center gap-2" 
                >
                  <Link to="/login">
                    <LogIn className="h-5 w-5 mr-1" />
                    Login
                  </Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
