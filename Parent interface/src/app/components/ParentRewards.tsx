import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, Gift, Star, TrendingUp, Award } from "lucide-react";
import { useNavigate } from "react-router";

interface Reward {
  id: string;
  name: string;
  pointsCost: number;
  description: string;
  category: "voucher" | "discount" | "activity";
  available: boolean;
}

export function ParentRewards() {
  const navigate = useNavigate();
  const [currentPoints, setCurrentPoints] = useState(285);
  const [weeklyPoints, setWeeklyPoints] = useState(65);

  const pointsSources = [
    { activity: "Planning meals", points: 10, earned: 3 },
    { activity: "Completing shopping lists", points: 15, earned: 2 },
    { activity: "Child completing missions", points: 5, earned: 6 },
    { activity: "Logging family meals", points: 5, earned: 5 },
    { activity: "Weekly consistency bonus", points: 25, earned: 1 },
  ];

  const availableRewards: Reward[] = [
    {
      id: "1",
      name: "£10 Tesco Voucher",
      pointsCost: 300,
      description: "Redeem for groceries",
      category: "voucher",
      available: false,
    },
    {
      id: "2",
      name: "£5 Tesco Voucher",
      pointsCost: 150,
      description: "Redeem for groceries",
      category: "voucher",
      available: true,
    },
    {
      id: "3",
      name: "20% off Sports Equipment",
      pointsCost: 200,
      description: "Decathlon discount code",
      category: "discount",
      available: true,
    },
    {
      id: "4",
      name: "Free Family Swim Pass",
      pointsCost: 250,
      description: "Local leisure center",
      category: "activity",
      available: true,
    },
    {
      id: "5",
      name: "£15 Amazon Voucher",
      pointsCost: 400,
      description: "For anything you need",
      category: "voucher",
      available: false,
    },
    {
      id: "6",
      name: "10% off Meal Kit Box",
      pointsCost: 100,
      description: "HelloFresh or Gousto",
      category: "discount",
      available: true,
    },
  ];

  const nextReward = availableRewards.find((r) => r.pointsCost > currentPoints);
  const pointsToNext = nextReward ? nextReward.pointsCost - currentPoints : 0;

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
            <h1 className="mb-1">Parent Rewards</h1>
            <p className="text-sm text-muted-foreground">
              Earn points, unlock rewards
            </p>
          </div>
        </div>

        {/* Current Points */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-secondary/20 to-primary/10 border-secondary/30 text-center">
          <Star className="w-12 h-12 text-primary mx-auto mb-3" />
          <div className="text-5xl font-bold text-primary mb-2">
            {currentPoints}
          </div>
          <p className="text-sm text-muted-foreground mb-4">Total points earned</p>
          <div className="bg-card/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">
              This week: +{weeklyPoints} points
            </p>
            <div className="flex items-center gap-2 text-xs text-primary">
              <TrendingUp className="w-3 h-3" />
              <span>On track for weekly bonus!</span>
            </div>
          </div>
        </Card>

        {/* Progress to Next Reward */}
        {nextReward && (
          <Card className="p-5 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-6 h-6 text-secondary" />
              <h3>Next reward</h3>
            </div>
            <div className="mb-3">
              <h4 className="mb-1">{nextReward.name}</h4>
              <p className="text-sm text-muted-foreground">
                {pointsToNext} points to go
              </p>
            </div>
            <div className="bg-accent rounded-full h-3 overflow-hidden">
              <div
                className="bg-secondary h-full transition-all"
                style={{
                  width: `${(currentPoints / nextReward.pointsCost) * 100}%`,
                }}
              />
            </div>
          </Card>
        )}

        {/* How to Earn Points */}
        <div className="mb-6">
          <h3 className="mb-3">How you earn points</h3>
          <div className="space-y-2">
            {pointsSources.map((source, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm mb-1">{source.activity}</h4>
                    <p className="text-xs text-muted-foreground">
                      Earned {source.earned} time{source.earned !== 1 ? "s" : ""} this
                      week
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      +{source.points}
                    </div>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Available Rewards */}
        <div className="mb-6">
          <h3 className="mb-3">Available rewards</h3>
          <div className="space-y-3">
            {availableRewards.map((reward) => {
              const canAfford = currentPoints >= reward.pointsCost;
              return (
                <Card
                  key={reward.id}
                  className={`p-4 ${
                    !canAfford ? "opacity-50" : "hover:shadow-md transition-all"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="mb-1">{reward.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {reward.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">
                          {reward.pointsCost} points
                        </span>
                      </div>
                    </div>
                    <Gift className="w-6 h-6 text-secondary flex-shrink-0" />
                  </div>
                  <Button
                    size="sm"
                    className="w-full"
                    disabled={!canAfford}
                    variant={canAfford ? "default" : "outline"}
                  >
                    {canAfford ? "Redeem now" : `${reward.pointsCost - currentPoints} more points needed`}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Info */}
        <Card className="p-4 bg-accent border-accent">
          <p className="text-sm text-accent-foreground">
            <span className="font-medium">💡 Keep going!</span> The more consistent
            you are with planning, shopping, and cooking, the faster you'll earn
            rewards. Every small action counts!
          </p>
        </Card>
      </div>
    </div>
  );
}
