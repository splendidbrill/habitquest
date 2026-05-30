import { createBrowserRouter, Navigate } from "react-router";
import { Welcome } from "./components/Welcome";
import { Onboarding } from "./components/Onboarding";
import { Home } from "./components/Home";
import { WeeklyPlan } from "./components/WeeklyPlan";
import { Progress } from "./components/Progress";
import { Recipes } from "./components/Recipes";
import { ParentDashboard } from "./components/ParentDashboard";
import { ParentHome } from "./components/ParentHome";
import { GroceryList } from "./components/GroceryList";
import { PantryMode } from "./components/PantryMode";
import { HealthySwaps } from "./components/HealthySwaps";
import { PhotoRewards } from "./components/PhotoRewards";
import { HandlingResistance } from "./components/HandlingResistance";
import { SupportiveResponses } from "./components/SupportiveResponses";
import { DifficultBehaviors } from "./components/DifficultBehaviors";
import { QuickMealMode } from "./components/QuickMealMode";
import { DinnerRescue } from "./components/DinnerRescue";
import { FoodBehaviourTips } from "./components/FoodBehaviourTips";
import { SchoolLunchTracker } from "./components/SchoolLunchTracker";
import { WeeklyReport } from "./components/WeeklyReport";
import { ParentRewards } from "./components/ParentRewards";
import { BudgetTracker } from "./components/BudgetTracker";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Welcome,
  },
  {
    path: "/onboarding",
    Component: Onboarding,
  },
  {
    path: "/home",
    Component: Home,
  },
  {
    path: "/plan",
    Component: WeeklyPlan,
  },
  {
    path: "/progress",
    Component: Progress,
  },
  {
    path: "/recipes",
    Component: Recipes,
  },
  {
    path: "/parent-dashboard",
    Component: ParentDashboard,
  },
  {
    path: "/parent-home",
    Component: ParentHome,
  },
  {
    path: "/grocery-list",
    Component: GroceryList,
  },
  {
    path: "/pantry-mode",
    Component: PantryMode,
  },
  {
    path: "/healthy-swaps",
    Component: HealthySwaps,
  },
  {
    path: "/photo-rewards",
    Component: PhotoRewards,
  },
  {
    path: "/handling-resistance",
    Component: HandlingResistance,
  },
  {
    path: "/supportive-responses",
    Component: SupportiveResponses,
  },
  {
    path: "/difficult-behaviors",
    Component: DifficultBehaviors,
  },
  {
    path: "/quick-meal-mode",
    Component: QuickMealMode,
  },
  {
    path: "/dinner-rescue",
    Component: DinnerRescue,
  },
  {
    path: "/food-behaviour-tips",
    Component: FoodBehaviourTips,
  },
  {
    path: "/school-lunch-tracker",
    Component: SchoolLunchTracker,
  },
  {
    path: "/weekly-report",
    Component: WeeklyReport,
  },
  {
    path: "/parent-rewards",
    Component: ParentRewards,
  },
  {
    path: "/budget-tracker",
    Component: BudgetTracker,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);