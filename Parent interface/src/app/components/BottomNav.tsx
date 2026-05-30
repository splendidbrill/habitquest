import { Home, Calendar, TrendingUp, User } from "lucide-react";
import { Link, useLocation } from "react-router";

export function BottomNav() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-4">
        <Link
          to="/home"
          className={`flex flex-col items-center justify-center flex-1 gap-1 transition-colors ${
            isActive("/home")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </Link>

        <Link
          to="/plan"
          className={`flex flex-col items-center justify-center flex-1 gap-1 transition-colors ${
            isActive("/plan")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calendar className="w-6 h-6" />
          <span className="text-xs">Plan</span>
        </Link>

        <Link
          to="/progress"
          className={`flex flex-col items-center justify-center flex-1 gap-1 transition-colors ${
            isActive("/progress")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <TrendingUp className="w-6 h-6" />
          <span className="text-xs">Progress</span>
        </Link>

        <Link
          to="/parent-home"
          className={`flex flex-col items-center justify-center flex-1 gap-1 transition-colors ${
            isActive("/parent-home") || isActive("/parent-dashboard")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="w-6 h-6" />
          <span className="text-xs">Parent</span>
        </Link>
      </div>
    </nav>
  );
}