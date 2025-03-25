
import { Loader2 } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="text-center animate-pulse-subtle">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <h2 className="mt-4 text-xl font-medium">Loading...</h2>
      </div>
    </div>
  );
};

export default LoadingScreen;
