import { createBrowserRouter } from "react-router";
import { OnboardingScreen } from "./components/onboarding-screen";
import { TodayScreen } from "./components/today-screen";
import { CheckInScreen } from "./components/check-in-screen";
import { MovementScreen } from "./components/movement-screen";
import { ReflectionScreen } from "./components/reflection-screen";
import { WellbeingTracker } from "./components/wellbeing-tracker";
import { WeeklyPlanner } from "./components/weekly-planner";
import { ResourcesScreen } from "./components/resources-screen";
import { HealthyEatingScreen } from "./components/healthy-eating-screen";
import { FeedbackScreen } from "./components/feedback-screen";
import { UrbanRunner } from "./components/games/urban-runner";
import { ReflexRhythm } from "./components/games/reflex-rhythm";
import { MicroWorkouts } from "./components/games/micro-workouts";
import { ProfileIdentity } from "./components/profile-identity";
import { FoodSwaps } from "./components/food-swaps";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: () => {
      const hasOnboarded = localStorage.getItem("hasOnboarded");
      if (!hasOnboarded) {
        return <OnboardingScreen />;
      }
      return <TodayScreen />;
    },
  },
  {
    path: "/check-in",
    Component: CheckInScreen,
  },
  {
    path: "/movement",
    Component: MovementScreen,
  },
  {
    path: "/reflection",
    Component: ReflectionScreen,
  },
  {
    path: "/wellbeing",
    Component: WellbeingTracker,
  },
  {
    path: "/weekly-plan",
    Component: WeeklyPlanner,
  },
  {
    path: "/resources",
    Component: ResourcesScreen,
  },
  {
    path: "/eating",
    Component: HealthyEatingScreen,
  },
  {
    path: "/feedback",
    Component: FeedbackScreen,
  },
  {
    path: "/urban-runner",
    Component: UrbanRunner,
  },
  {
    path: "/reflex-rhythm",
    Component: ReflexRhythm,
  },
  {
    path: "/micro-workouts",
    Component: MicroWorkouts,
  },
  {
    path: "/profile",
    Component: ProfileIdentity,
  },
  {
    path: "/food-swaps",
    Component: FoodSwaps,
  },
]);