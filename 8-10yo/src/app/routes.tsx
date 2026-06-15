import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import WorldMap from "./pages/WorldMap";
import DailyQuests from "./pages/DailyQuests";
import AvatarCreator from "./pages/AvatarCreator";
import NutritionForest from "./pages/NutritionForest";
import ActivityArena from "./pages/ActivityArena";
import SleepMountain from "./pages/SleepMountain";
import ConfidenceCastle from "./pages/ConfidenceCastle";
import Rewards from "./pages/Rewards";
import MiniGame from "./pages/MiniGame";
import Profile from "./pages/Profile";
import GameHub from "./pages/GameHub";
import FruitSnake from "./pages/FruitSnake";
import JungleRunner from "./pages/JungleRunner";
import SuperheroWorkout from "./pages/SuperheroWorkout";
import FoodTracker from "./pages/FoodTracker";
import ChooseDinner from "./pages/ChooseDinner";
import VeggieWeek from "./pages/VeggieWeek";
import KitchenHelper from "./pages/KitchenHelper";
import LunchBuilder from "./pages/LunchBuilder";
import SnackSwap from "./pages/SnackSwap";
import SchoolFuel from "./pages/SchoolFuel";
import EnergyMeter from "./pages/EnergyMeter";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/map",
    Component: WorldMap,
  },
  {
    path: "/quests",
    Component: DailyQuests,
  },
  {
    path: "/avatar",
    Component: AvatarCreator,
  },
  {
    path: "/nutrition",
    Component: NutritionForest,
  },
  {
    path: "/activity",
    Component: ActivityArena,
  },
  {
    path: "/sleep",
    Component: SleepMountain,
  },
  {
    path: "/confidence",
    Component: ConfidenceCastle,
  },
  {
    path: "/rewards",
    Component: Rewards,
  },
  {
    path: "/game/:gameType",
    Component: MiniGame,
  },
  {
    path: "/profile",
    Component: Profile,
  },
  {
    path: "/game-hub",
    Component: GameHub,
  },
  {
    path: "/fruit-snake",
    Component: FruitSnake,
  },
  {
    path: "/jungle-runner",
    Component: JungleRunner,
  },
  {
    path: "/superhero-workout",
    Component: SuperheroWorkout,
  },
  {
    path: "/food-tracker",
    Component: FoodTracker,
  },
  {
    path: "/choose-dinner",
    Component: ChooseDinner,
  },
  {
    path: "/veggie-week",
    Component: VeggieWeek,
  },
  {
    path: "/kitchen-helper",
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
    path: "/energy-meter",
    Component: EnergyMeter,
  },
]);