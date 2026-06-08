import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Calendar, TrendingUp, User } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import type { Pillar } from '../services/syncService';
import { SignIn } from '../screens/auth/SignIn';
import { SignUp } from '../screens/auth/SignUp';
import { ProfileSelector } from '../screens/ProfileSelector';
import { AddChild } from '../screens/AddChild';
import { FamilyCode } from '../screens/FamilyCode';
import { WorldMap } from '../screens/WorldMap';
import { PillarCheckIn } from '../screens/PillarCheckIn';
import { StreakMilestone } from '../screens/StreakMilestone';
import { FamilyChallengesManager } from '../screens/FamilyChallengesManager';
import { KidsFamilyChallenges } from '../screens/KidsFamilyChallenges';
import { BarrierSolver } from '../screens/BarrierSolver';
import { MysteryBox } from '../screens/MysteryBox';
import { FamilyAdventureMap } from '../screens/FamilyAdventureMap';
import { FamilyAdventureDetail } from '../screens/FamilyAdventureDetail';
import { AIChef } from '../screens/AIChef';

import { Welcome } from '../screens/Welcome';
import { IntroVideo } from '../screens/onboarding/IntroVideo';
import { Onboarding } from '../screens/Onboarding';
import { FoodSwipe } from '../screens/onboarding/FoodSwipe';
import { ActivitySwipe } from '../screens/onboarding/ActivitySwipe';
import { HomeScreen } from '../screens/Home';
import { WeeklyPlan } from '../screens/WeeklyPlan';
import { Progress } from '../screens/Progress';
import { Recipes } from '../screens/Recipes';
import { ParentHome } from '../screens/ParentHome';
import { ParentDashboard } from '../screens/ParentDashboard';
import { GroceryList } from '../screens/GroceryList';
import { PantryMode } from '../screens/PantryMode';
import { HealthySwaps } from '../screens/HealthySwaps';
import { PhotoRewards } from '../screens/PhotoRewards';
import { HandlingResistance } from '../screens/HandlingResistance';
import { SupportiveResponses } from '../screens/SupportiveResponses';
import { DifficultBehaviors } from '../screens/DifficultBehaviors';
import { QuickMealMode } from '../screens/QuickMealMode';
import { DinnerRescue } from '../screens/DinnerRescue';
import { FoodBehaviourTips } from '../screens/FoodBehaviourTips';
import { SchoolLunchTracker } from '../screens/SchoolLunchTracker';
import { WeeklyReport } from '../screens/WeeklyReport';
import { ParentRewards } from '../screens/ParentRewards';
import { BudgetTracker } from '../screens/BudgetTracker';

// Role Selection & Age Group
import { RoleSelection } from '../screens/RoleSelection';
import { AgeGroup } from '../screens/AgeGroup';
import { AgePlaceholder } from '../screens/AgePlaceholder';

// Kids 6-8 Screens
import { KidsAvatarSelection } from '../screens/kids/KidsAvatarSelection';
import { KidsAvatarCustomize } from '../screens/kids/KidsAvatarCustomize';
import { KidsBuddyHome } from '../screens/kids/KidsBuddyHome';
import { KidsAvatarStatus } from '../screens/kids/KidsAvatarStatus';
import { KidsDailyMission } from '../screens/kids/KidsDailyMission';
import { KidsSuccessCelebration } from '../screens/kids/KidsSuccessCelebration';
import { KidsDinnerChoice } from '../screens/kids/KidsDinnerChoice';
import { KidsVeggieSelector } from '../screens/kids/KidsVeggieSelector';
import { KidsKitchenHelper } from '../screens/kids/KidsKitchenHelper';
import { KidsFoodDiscovery } from '../screens/kids/KidsFoodDiscovery';
import { KidsRewardsScreen } from '../screens/kids/KidsRewardsScreen';
import { KidsGameHub } from '../screens/kids/KidsGameHub';
import { KidsFruitSnakeGame } from '../screens/kids/KidsFruitSnakeGame';
import { KidsJungleRunnerGame } from '../screens/kids/KidsJungleRunnerGame';
import { KidsSuperheroWorkout } from '../screens/kids/KidsSuperheroWorkout';
import { KidsArcheryFoodGame } from '../screens/kids/KidsArcheryFoodGame';
import { KidsProgressMap } from '../screens/kids/KidsProgressMap';
import { KidsCollectiblesViewer } from '../screens/kids/KidsCollectiblesViewer';

// Kids 12 (teen wellbeing theme)
import { Kids12Onboarding } from '../screens/kids12/Kids12Onboarding';
import { Kids12Today } from '../screens/kids12/Kids12Today';
import { Kids12CheckIn } from '../screens/kids12/Kids12CheckIn';
import { Kids12Movement } from '../screens/kids12/Kids12Movement';
import { Kids12Reflection } from '../screens/kids12/Kids12Reflection';
import { Kids12WellbeingTracker } from '../screens/kids12/Kids12WellbeingTracker';
import { Kids12WeeklyPlanner } from '../screens/kids12/Kids12WeeklyPlanner';
import { Kids12Resources } from '../screens/kids12/Kids12Resources';
import { Kids12HealthyEating } from '../screens/kids12/Kids12HealthyEating';
import { Kids12Feedback } from '../screens/kids12/Kids12Feedback';
import { Kids12ProfileIdentity } from '../screens/kids12/Kids12ProfileIdentity';
import { Kids12FoodSwaps } from '../screens/kids12/Kids12FoodSwaps';
import { Kids12UrbanRunner } from '../screens/kids12/Kids12UrbanRunner';
import { Kids12ReflexRhythm } from '../screens/kids12/Kids12ReflexRhythm';
import { Kids12MicroWorkouts } from '../screens/kids12/Kids12MicroWorkouts';

// Kids 8 (athlete/sports theme)
import { Kids8AthleteOnboarding } from '../screens/kids8/Kids8AthleteOnboarding';
import { Kids8PersonalizationSetup } from '../screens/kids8/Kids8PersonalizationSetup';
import { Kids8TrainingDashboard } from '../screens/kids8/Kids8TrainingDashboard';
import { Kids8FuelStation } from '../screens/kids8/Kids8FuelStation';
import { Kids8Achievements } from '../screens/kids8/Kids8Achievements';
import { Kids8ProgressTracker } from '../screens/kids8/Kids8ProgressTracker';
import { Kids8DailyMission } from '../screens/kids8/Kids8DailyMission';
import { Kids8SuccessCelebration } from '../screens/kids8/Kids8SuccessCelebration';
import { Kids8DinnerChoice } from '../screens/kids8/Kids8DinnerChoice';
import { Kids8VeggieSelector } from '../screens/kids8/Kids8VeggieSelector';
import { Kids8KitchenHelper } from '../screens/kids8/Kids8KitchenHelper';
import { Kids8LunchBuilder } from '../screens/kids8/Kids8LunchBuilder';
import { Kids8SnackSwap } from '../screens/kids8/Kids8SnackSwap';
import { Kids8SchoolFuel } from '../screens/kids8/Kids8SchoolFuel';
import { Kids8AskCoach } from '../screens/kids8/Kids8AskCoach';
import { Kids8EnergyMeter } from '../screens/kids8/Kids8EnergyMeter';
import { Kids8RunnerChallenge } from '../screens/kids8/Kids8RunnerChallenge';
import { Kids8SkillDrills } from '../screens/kids8/Kids8SkillDrills';
import { Kids8TrainLikePro } from '../screens/kids8/Kids8TrainLikePro';

import { colors } from '../theme';

export type RootStackParamList = {
  // Auth-gated entry
  ProfileSelector: undefined;
  AddChild: undefined;
  FamilyCode: undefined;
  WorldMap: undefined;
  PillarCheckIn: undefined;
  StreakMilestone: { milestone: number };
  FamilyChallengesManager: undefined;
  KidsFamilyChallenges: undefined;
  BarrierSolver: { childName: string; pillar: Pillar };
  MysteryBox: { returnScreen: string };
  FamilyAdventureMap: { parentId?: string };
  FamilyAdventureDetail: {
    adventureDbId: string;
    stageIndex: number;
    parentId: string;
  };
  AIChef: undefined;
  // Entry
  RoleSelection: undefined;
  AgeGroup: undefined;
  AgePlaceholder: { ageGroup: string };
  // Parent flow
  Welcome: undefined;
  IntroVideo: { mode?: 'intro' | 'endcard' } | undefined;
  Onboarding: undefined;
  FoodSwipe: undefined;
  ActivitySwipe: undefined;
  MainApp: undefined;
  // Parent detail screens
  GroceryList: undefined;
  PantryMode: undefined;
  HealthySwaps: undefined;
  PhotoRewards: undefined;
  HandlingResistance: undefined;
  SupportiveResponses: undefined;
  DifficultBehaviors: undefined;
  QuickMealMode: undefined;
  DinnerRescue: undefined;
  FoodBehaviourTips: undefined;
  SchoolLunchTracker: undefined;
  WeeklyReport: undefined;
  ParentRewards: undefined;
  BudgetTracker: undefined;
  Recipes: undefined;
  // Kids 6-8
  KidsAvatarSelection: undefined;
  KidsAvatarCustomize: undefined;
  KidsBuddyHome: undefined;
  KidsAvatarStatus: undefined;
  KidsDailyMission: undefined;
  KidsSuccessCelebration:
    | { missionId?: string; missionTitle?: string; tags?: string[] }
    | undefined;
  KidsDinnerChoice: undefined;
  KidsVeggieSelector: undefined;
  KidsKitchenHelper: undefined;
  KidsFoodDiscovery: undefined;
  KidsRewardsScreen: undefined;
  KidsGameHub: undefined;
  KidsFruitSnakeGame: undefined;
  KidsJungleRunnerGame: undefined;
  KidsSuperheroWorkout: undefined;
  KidsArcheryFoodGame: undefined;
  KidsProgressMap: undefined;
  KidsCollectiblesViewer: undefined;
  // Kids 12 (teen wellbeing theme)
  Kids12Onboarding: undefined;
  Kids12Today: undefined;
  Kids12CheckIn: undefined;
  Kids12Movement: undefined;
  Kids12Reflection: undefined;
  Kids12WellbeingTracker: undefined;
  Kids12WeeklyPlanner: undefined;
  Kids12Resources: undefined;
  Kids12HealthyEating: undefined;
  Kids12Feedback: undefined;
  Kids12ProfileIdentity: undefined;
  Kids12FoodSwaps: undefined;
  Kids12UrbanRunner: undefined;
  Kids12ReflexRhythm: undefined;
  Kids12MicroWorkouts: undefined;
  // Kids 8 (athlete/sports theme)
  Kids8AthleteOnboarding: undefined;
  Kids8PersonalizationSetup: undefined;
  Kids8TrainingDashboard: undefined;
  Kids8FuelStation: undefined;
  Kids8Achievements: undefined;
  Kids8ProgressTracker: undefined;
  Kids8DailyMission: undefined;
  Kids8SuccessCelebration: undefined;
  Kids8DinnerChoice: undefined;
  Kids8VeggieSelector: undefined;
  Kids8KitchenHelper: undefined;
  Kids8LunchBuilder: undefined;
  Kids8SnackSwap: undefined;
  Kids8SchoolFuel: undefined;
  Kids8AskCoach: undefined;
  Kids8EnergyMeter: undefined;
  Kids8RunnerChallenge: undefined;
  Kids8SkillDrills: undefined;
  Kids8TrainLikePro: undefined;
};

export type TabParamList = {
  HomeTab: undefined;
  PlanTab: undefined;
  ProgressTab: undefined;
  ParentTab: undefined;
};

export type ParentStackParamList = {
  ParentHome: undefined;
  ParentDashboard: undefined;
};

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const ParentStack = createNativeStackNavigator<ParentStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="SignIn" component={SignIn} />
      <AuthStack.Screen name="SignUp" component={SignUp} />
    </AuthStack.Navigator>
  );
}

function ParentTabStack() {
  return (
    <ParentStack.Navigator screenOptions={{ headerShown: false }}>
      <ParentStack.Screen name="ParentHome" component={ParentHome} />
      <ParentStack.Screen name="ParentDashboard" component={ParentDashboard} />
    </ParentStack.Navigator>
  );
}

function CustomTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();

  const tabs = [
    { key: 'HomeTab', label: 'Home', icon: Home, route: 'HomeTab' },
    { key: 'PlanTab', label: 'Plan', icon: Calendar, route: 'PlanTab' },
    {
      key: 'ProgressTab',
      label: 'Progress',
      icon: TrendingUp,
      route: 'ProgressTab',
    },
    { key: 'ParentTab', label: 'Parent', icon: User, route: 'ParentTab' },
  ];

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom || 8 }]}>
      {tabs.map((tab, index) => {
        const isFocused = state.index === index;
        const Icon = tab.icon;
        return (
          <Pressable
            key={tab.key}
            style={styles.tabItem}
            onPress={() => navigation.navigate(tab.route)}
          >
            <Icon
              size={24}
              color={isFocused ? colors.primary : colors.mutedForeground}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: isFocused ? colors.primary : colors.mutedForeground },
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="PlanTab" component={WeeklyPlan} />
      <Tab.Screen name="ProgressTab" component={Progress} />
      <Tab.Screen name="ParentTab" component={ParentTabStack} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
        }}
      >
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  if (!session) {
    return <AuthNavigator />;
  }

  return (
    <RootStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="ProfileSelector"
    >
      {/* Profile selection — first screen after auth */}
      <RootStack.Screen name="ProfileSelector" component={ProfileSelector} />
      <RootStack.Screen name="AddChild" component={AddChild} />
      <RootStack.Screen name="FamilyCode" component={FamilyCode} />
      <RootStack.Screen name="WorldMap" component={WorldMap} />
      <RootStack.Screen name="PillarCheckIn" component={PillarCheckIn} />
      <RootStack.Screen name="StreakMilestone" component={StreakMilestone} />
      <RootStack.Screen
        name="FamilyChallengesManager"
        component={FamilyChallengesManager}
      />
      <RootStack.Screen
        name="KidsFamilyChallenges"
        component={KidsFamilyChallenges}
      />
      <RootStack.Screen name="BarrierSolver" component={BarrierSolver} />
      <RootStack.Screen name="MysteryBox" component={MysteryBox} />
      <RootStack.Screen
        name="FamilyAdventureMap"
        component={FamilyAdventureMap}
      />
      <RootStack.Screen
        name="FamilyAdventureDetail"
        component={FamilyAdventureDetail}
      />
      <RootStack.Screen name="AIChef" component={AIChef} />
      {/* Entry point */}
      <RootStack.Screen name="RoleSelection" component={RoleSelection} />
      <RootStack.Screen name="AgeGroup" component={AgeGroup} />
      <RootStack.Screen name="AgePlaceholder" component={AgePlaceholder} />

      {/* Parent flow */}
      <RootStack.Screen name="Welcome" component={Welcome} />
      <RootStack.Screen name="IntroVideo" component={IntroVideo} />
      <RootStack.Screen name="Onboarding" component={Onboarding} />
      <RootStack.Screen name="FoodSwipe" component={FoodSwipe} />
      <RootStack.Screen name="ActivitySwipe" component={ActivitySwipe} />
      <RootStack.Screen name="MainApp" component={MainTabs} />

      {/* Parent detail screens */}
      <RootStack.Screen name="GroceryList" component={GroceryList} />
      <RootStack.Screen name="PantryMode" component={PantryMode} />
      <RootStack.Screen name="HealthySwaps" component={HealthySwaps} />
      <RootStack.Screen name="PhotoRewards" component={PhotoRewards} />
      <RootStack.Screen
        name="HandlingResistance"
        component={HandlingResistance}
      />
      <RootStack.Screen
        name="SupportiveResponses"
        component={SupportiveResponses}
      />
      <RootStack.Screen
        name="DifficultBehaviors"
        component={DifficultBehaviors}
      />
      <RootStack.Screen name="QuickMealMode" component={QuickMealMode} />
      <RootStack.Screen name="DinnerRescue" component={DinnerRescue} />
      <RootStack.Screen
        name="FoodBehaviourTips"
        component={FoodBehaviourTips}
      />
      <RootStack.Screen
        name="SchoolLunchTracker"
        component={SchoolLunchTracker}
      />
      <RootStack.Screen name="WeeklyReport" component={WeeklyReport} />
      <RootStack.Screen name="ParentRewards" component={ParentRewards} />
      <RootStack.Screen name="BudgetTracker" component={BudgetTracker} />
      <RootStack.Screen name="Recipes" component={Recipes} />

      {/* Kids 6-8 screens */}
      <RootStack.Screen
        name="KidsAvatarSelection"
        component={KidsAvatarSelection}
      />
      <RootStack.Screen
        name="KidsAvatarCustomize"
        component={KidsAvatarCustomize}
      />
      <RootStack.Screen name="KidsBuddyHome" component={KidsBuddyHome} />
      <RootStack.Screen name="KidsAvatarStatus" component={KidsAvatarStatus} />
      <RootStack.Screen name="KidsDailyMission" component={KidsDailyMission} />
      <RootStack.Screen
        name="KidsSuccessCelebration"
        component={KidsSuccessCelebration}
      />
      <RootStack.Screen name="KidsDinnerChoice" component={KidsDinnerChoice} />
      <RootStack.Screen
        name="KidsVeggieSelector"
        component={KidsVeggieSelector}
      />
      <RootStack.Screen
        name="KidsKitchenHelper"
        component={KidsKitchenHelper}
      />
      <RootStack.Screen
        name="KidsFoodDiscovery"
        component={KidsFoodDiscovery}
      />
      <RootStack.Screen
        name="KidsRewardsScreen"
        component={KidsRewardsScreen}
      />
      <RootStack.Screen name="KidsGameHub" component={KidsGameHub} />
      <RootStack.Screen
        name="KidsFruitSnakeGame"
        component={KidsFruitSnakeGame}
      />
      <RootStack.Screen
        name="KidsJungleRunnerGame"
        component={KidsJungleRunnerGame}
      />
      <RootStack.Screen
        name="KidsSuperheroWorkout"
        component={KidsSuperheroWorkout}
      />
      <RootStack.Screen
        name="KidsArcheryFoodGame"
        component={KidsArcheryFoodGame}
      />
      <RootStack.Screen name="KidsProgressMap" component={KidsProgressMap} />
      <RootStack.Screen
        name="KidsCollectiblesViewer"
        component={KidsCollectiblesViewer}
      />

      {/* Kids 12 screens */}
      <RootStack.Screen name="Kids12Onboarding" component={Kids12Onboarding} />
      <RootStack.Screen name="Kids12Today" component={Kids12Today} />
      <RootStack.Screen name="Kids12CheckIn" component={Kids12CheckIn} />
      <RootStack.Screen name="Kids12Movement" component={Kids12Movement} />
      <RootStack.Screen name="Kids12Reflection" component={Kids12Reflection} />
      <RootStack.Screen
        name="Kids12WellbeingTracker"
        component={Kids12WellbeingTracker}
      />
      <RootStack.Screen
        name="Kids12WeeklyPlanner"
        component={Kids12WeeklyPlanner}
      />
      <RootStack.Screen name="Kids12Resources" component={Kids12Resources} />
      <RootStack.Screen
        name="Kids12HealthyEating"
        component={Kids12HealthyEating}
      />
      <RootStack.Screen name="Kids12Feedback" component={Kids12Feedback} />
      <RootStack.Screen
        name="Kids12ProfileIdentity"
        component={Kids12ProfileIdentity}
      />
      <RootStack.Screen name="Kids12FoodSwaps" component={Kids12FoodSwaps} />
      <RootStack.Screen
        name="Kids12UrbanRunner"
        component={Kids12UrbanRunner}
      />
      <RootStack.Screen
        name="Kids12ReflexRhythm"
        component={Kids12ReflexRhythm}
      />
      <RootStack.Screen
        name="Kids12MicroWorkouts"
        component={Kids12MicroWorkouts}
      />

      {/* Kids 8 screens */}
      <RootStack.Screen
        name="Kids8AthleteOnboarding"
        component={Kids8AthleteOnboarding}
      />
      <RootStack.Screen
        name="Kids8PersonalizationSetup"
        component={Kids8PersonalizationSetup}
      />
      <RootStack.Screen
        name="Kids8TrainingDashboard"
        component={Kids8TrainingDashboard}
      />
      <RootStack.Screen name="Kids8FuelStation" component={Kids8FuelStation} />
      <RootStack.Screen
        name="Kids8Achievements"
        component={Kids8Achievements}
      />
      <RootStack.Screen
        name="Kids8ProgressTracker"
        component={Kids8ProgressTracker}
      />
      <RootStack.Screen
        name="Kids8DailyMission"
        component={Kids8DailyMission}
      />
      <RootStack.Screen
        name="Kids8SuccessCelebration"
        component={Kids8SuccessCelebration}
      />
      <RootStack.Screen
        name="Kids8DinnerChoice"
        component={Kids8DinnerChoice}
      />
      <RootStack.Screen
        name="Kids8VeggieSelector"
        component={Kids8VeggieSelector}
      />
      <RootStack.Screen
        name="Kids8KitchenHelper"
        component={Kids8KitchenHelper}
      />
      <RootStack.Screen
        name="Kids8LunchBuilder"
        component={Kids8LunchBuilder}
      />
      <RootStack.Screen name="Kids8SnackSwap" component={Kids8SnackSwap} />
      <RootStack.Screen name="Kids8SchoolFuel" component={Kids8SchoolFuel} />
      <RootStack.Screen name="Kids8AskCoach" component={Kids8AskCoach} />
      <RootStack.Screen name="Kids8EnergyMeter" component={Kids8EnergyMeter} />
      <RootStack.Screen
        name="Kids8RunnerChallenge"
        component={Kids8RunnerChallenge}
      />
      <RootStack.Screen name="Kids8SkillDrills" component={Kids8SkillDrills} />
      <RootStack.Screen
        name="Kids8TrainLikePro"
        component={Kids8TrainLikePro}
      />
    </RootStack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 4,
    gap: 3,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
});
