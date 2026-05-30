import { createBrowserRouter } from "react-router";
import { AthleteOnboarding } from "./components/athlete-onboarding";
import { TrainingDashboard } from "./components/training-dashboard";
import { FuelStation } from "./components/fuel-station";
import { Achievements } from "./components/achievements";
import { ProgressTracker } from "./components/progress-tracker";
import { DailyMission } from "./components/daily-mission";
import { SuccessCelebration } from "./components/success-celebration";
import { DinnerChoice } from "./components/dinner-choice";
import { VeggieSelector } from "./components/veggie-selector";
import { KitchenHelper } from "./components/kitchen-helper";
import { LunchBuilder } from "./components/lunch-builder";
import { SnackSwap } from "./components/snack-swap";
import { SchoolFuel } from "./components/school-fuel";
import { AskCoach } from "./components/ask-coach";
import { EnergyMeter } from "./components/energy-meter";
import { RunnerChallenge } from "./components/runner-challenge";
import { SkillDrills } from "./components/skill-drills";
import { TrainLikePro } from "./components/train-like-pro";
import { PersonalizationSetup } from "./components/personalization-setup";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AthleteOnboarding,
  },
  {
    path: "/personalize",
    Component: PersonalizationSetup,
  },
  {
    path: "/training",
    Component: TrainingDashboard,
  },
  {
    path: "/fuel-station",
    Component: FuelStation,
  },
  {
    path: "/achievements",
    Component: Achievements,
  },
  {
    path: "/progress",
    Component: ProgressTracker,
  },
  {
    path: "/mission",
    Component: DailyMission,
  },
  {
    path: "/success",
    Component: SuccessCelebration,
  },
  {
    path: "/dinner",
    Component: DinnerChoice,
  },
  {
    path: "/veggie",
    Component: VeggieSelector,
  },
  {
    path: "/kitchen",
    Component: KitchenHelper,
  },
  {
    path: "/lunch-builder",
    Component: LunchBuilder,
  },
  {
    path: "/snack-swap",
    Component: SnackSwap,
  },
  {
    path: "/school-fuel",
    Component: SchoolFuel,
  },
  {
    path: "/ask-coach",
    Component: AskCoach,
  },
  {
    path: "/energy-meter",
    Component: EnergyMeter,
  },
  {
    path: "/runner-challenge",
    Component: RunnerChallenge,
  },
  {
    path: "/skill-drills",
    Component: SkillDrills,
  },
  {
    path: "/train-like-pro",
    Component: TrainLikePro,
  },
]);