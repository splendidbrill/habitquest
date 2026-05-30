import { useNavigate } from "react-router";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";

export function Welcome() {
  const navigate = useNavigate();

  useEffect(() => {
    const isOnboarded = localStorage.getItem("onboardingComplete");
    if (isOnboarded === "true") {
      navigate("/home");
    }
  }, [navigate]);

  const handleGetStarted = () => {
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-background to-secondary/10 flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        {/* Logo/Icon */}
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Heart className="w-10 h-10 text-secondary-foreground" />
        </div>

        {/* Title */}
        <h1 className="mb-3">Welcome to HealthySteps</h1>
        <p className="text-muted-foreground mb-8">
          Supporting UK parents with simple, culturally-appropriate meal ideas and fun activities for children aged 7-11
        </p>

        {/* Benefits */}
        <div className="space-y-4 mb-8 text-left">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-primary">✓</span>
            </div>
            <div>
              <h4>Weekly plans that fit your life</h4>
              <p className="text-sm text-muted-foreground">
                Simple diet and movement ideas, not rigid rules
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-primary">✓</span>
            </div>
            <div>
              <h4>Clinically informed, family focused</h4>
              <p className="text-sm text-muted-foreground">
                Evidence-based guidance that reduces overwhelm
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-primary">✓</span>
            </div>
            <div>
              <h4>Track progress, not weight</h4>
              <p className="text-sm text-muted-foreground">
                Celebrate behaviour changes and small wins
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Button size="lg" className="w-full" onClick={handleGetStarted}>
          Get started
        </Button>

        <p className="text-xs text-muted-foreground mt-6">
          Takes about 2 minutes to personalise your plan
        </p>
      </div>
    </div>
  );
}