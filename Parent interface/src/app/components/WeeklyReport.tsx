import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, TrendingUp, Award, Heart, Utensils, Footprints } from "lucide-react";
import { useNavigate } from "react-router";

export function WeeklyReport() {
  const navigate = useNavigate();

  const weeklyStats = {
    activityStreak: 5,
    healthySnackChoices: 12,
    missionsCompleted: 8,
    familyMealsCookeds: 8,
    weekNumber: 3,
  };

  const achievements = [
    {
      title: "Consistent Activity",
      description: "Your family stayed active 5 days this week!",
      icon: Footprints,
      color: "text-primary",
    },
    {
      title: "Healthy Snacking",
      description: "12 healthy snack choices - amazing!",
      icon: Heart,
      color: "text-secondary",
    },
    {
      title: "Home Cooking Champion",
      description: "8 home-cooked family meals this week",
      icon: Utensils,
      color: "text-accent-foreground",
    },
  ];

  const weekComparison = [
    { week: "Week 1", meals: 4, activity: 3 },
    { week: "Week 2", meals: 6, activity: 4 },
    { week: "Week 3", meals: 8, activity: 5 },
  ];

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/parent-dashboard")}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="mb-1">Weekly Family Report</h1>
            <p className="text-sm text-muted-foreground">
              Week {weeklyStats.weekNumber} Summary
            </p>
          </div>
        </div>

        {/* Big Win Card */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-secondary/20 to-primary/10 border-secondary/30 text-center">
          <Award className="w-16 h-16 text-secondary mx-auto mb-4" />
          <h2 className="mb-2">Brilliant week!</h2>
          <p className="text-lg mb-1">
            Your family completed{" "}
            <span className="font-bold text-primary">
              {weeklyStats.familyMealsCookeds} healthy meals
            </span>{" "}
            this week! 🎉
          </p>
          <p className="text-sm text-muted-foreground">
            That's {weeklyStats.familyMealsCookeds - weekComparison[1].meals} more than
            last week
          </p>
        </Card>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="p-5 text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {weeklyStats.activityStreak}
            </div>
            <p className="text-sm text-muted-foreground">Activity streak (days)</p>
          </Card>
          <Card className="p-5 text-center">
            <div className="text-4xl font-bold text-secondary mb-2">
              {weeklyStats.healthySnackChoices}
            </div>
            <p className="text-sm text-muted-foreground">Healthy snack choices</p>
          </Card>
          <Card className="p-5 text-center">
            <div className="text-4xl font-bold text-accent-foreground mb-2">
              {weeklyStats.missionsCompleted}
            </div>
            <p className="text-sm text-muted-foreground">Missions completed</p>
          </Card>
          <Card className="p-5 text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {weeklyStats.familyMealsCookeds}
            </div>
            <p className="text-sm text-muted-foreground">Family meals cooked</p>
          </Card>
        </div>

        {/* Achievements */}
        <div className="mb-6">
          <h3 className="mb-3">This week's achievements</h3>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <achievement.icon className={`w-6 h-6 ${achievement.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Progress Over Time */}
        <Card className="p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3>Your progress over time</h3>
          </div>
          <div className="space-y-4">
            {weekComparison.map((week, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{week.week}</span>
                  <span className="text-xs text-muted-foreground">
                    {week.meals} meals • {week.activity} active days
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-accent rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all"
                      style={{ width: `${(week.meals / 10) * 100}%` }}
                    />
                  </div>
                  <div className="flex-1 bg-accent rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-secondary h-full transition-all"
                      style={{ width: `${(week.activity / 7) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Healthy meals</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary" />
              <span className="text-muted-foreground">Active days</span>
            </div>
          </div>
        </Card>

        {/* Encouragement */}
        <Card className="p-5 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 text-center">
          <h3 className="mb-2">Keep going! 💪</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Every small step counts. You're building healthy habits that will last
            a lifetime. Your family is doing brilliantly!
          </p>
          <Button onClick={() => navigate("/home")}>Back to dashboard</Button>
        </Card>
      </div>
    </div>
  );
}
