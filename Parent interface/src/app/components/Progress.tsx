import { Card } from "./ui/card";
import { BottomNav } from "./BottomNav";
import { Apple, Footprints, Moon, Trophy, Sparkles } from "lucide-react";

export function Progress() {
  const achievements = [
    {
      id: 1,
      title: "Tried 3 new Indian dishes",
      description: "Explored dal with vegetables, chicken tikka wraps, and vegetable pulao",
      icon: Apple,
      color: "bg-primary/10 text-primary",
      date: "This week",
    },
    {
      id: 2,
      title: "5 park football sessions",
      description: "Great active play - building skills and fitness!",
      icon: Footprints,
      color: "bg-secondary/10 text-secondary",
      date: "This week",
    },
    {
      id: 3,
      title: "Water with meals",
      description: "Chose water instead of juice 6 out of 7 days",
      icon: Moon,
      color: "bg-accent text-accent-foreground",
      date: "This week",
    },
  ];

  const weeklyStreak = 3;
  const thisWeekActivities = 14;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-2">Your progress</h1>
          <p className="text-muted-foreground">
            Celebrating the small wins that matter
          </p>
        </div>

        {/* Celebration card */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-secondary/20 to-primary/20 border-secondary/30">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Trophy className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="mb-2">Great work! 🎉</h2>
              <p className="text-sm text-muted-foreground">
                You've completed {thisWeekActivities} activities this week.
                Every step counts!
              </p>
            </div>
          </div>
        </Card>

        {/* Streak card */}
        <Card className="p-5 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h3>Weekly streak</h3>
              <p className="text-sm text-muted-foreground">
                {weeklyStreak} weeks in a row
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            You've been using the app for {weeklyStreak} consecutive weeks.
            Keep up the momentum!
          </p>
        </Card>

        {/* This week's achievements */}
        <div className="mb-6">
          <h2 className="mb-4">This week's highlights</h2>
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${achievement.color}`}
                  >
                    <achievement.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {achievement.description}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {achievement.date}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Behaviour tracking */}
        <Card className="p-5 mb-6">
          <h3 className="mb-4">Behaviour patterns</h3>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">New foods tried</span>
                <span className="text-sm font-medium">3 this week</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: "60%" }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Active play sessions</span>
                <span className="text-sm font-medium">5 this week</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-secondary h-2 rounded-full transition-all"
                  style={{ width: "85%" }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Routine consistency</span>
                <span className="text-sm font-medium">6 out of 7 days</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-accent text-accent-foreground h-2 rounded-full transition-all"
                  style={{ width: "86%" }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Encouraging message */}
        <Card className="p-5 bg-accent border-accent">
          <h3 className="mb-2">Remember</h3>
          <p className="text-sm text-accent-foreground">
            We're tracking behaviours and habits, not numbers on a scale. Every
            small positive change is worth celebrating. You're doing a great
            job! 💚
          </p>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}