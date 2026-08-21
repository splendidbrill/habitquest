// Unit tests for the weekly-plan logic — covers the "Thursday bug" (today's
// weekday row must carry today's daily mission), the Home/Plan consistency
// source, and that every activity has real how-to guidance behind it.

import {
  buildLocalPlan,
  emptyPreferenceModel,
} from '../src/services/localPlanBuilder';
import {
  selectDailyMovementQuest,
  movementQuests,
  ageToBand,
} from '../src/data/movementQuests';
import type { FamilyProfile } from '../src/data/familyProfile';
import { todayName } from '../src/services/weeklyPlanStore';

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// Minimal profile fixture. Built inline (type-only import) so the test doesn't
// pull in familyProfile.ts's runtime deps (Supabase). Empty arrays/records are
// the same "no signal yet" shape a fresh family has.
const profile = {
  goals: [],
  childAge: 8,
  cultures: [],
  foodGroups: [],
  prepTime: 'medium',
  budget: 'medium',
  dietary: [],
  activityLevel: 'moderate',
  spaces: [],
  equipment: [],
  supportNeeds: [],
  familyStructure: '',
  weekdayBusyness: 3,
  difficultFoods: [],
  childInterests: [],
  barriers: [],
  threeMonthGoal: '',
  postcode: '',
  familyPersonality: {},
  cuisinePrefs: {},
  activityPrefs: {},
} as unknown as FamilyProfile;

describe('todayName', () => {
  test('returns the current weekday name', () => {
    expect(todayName()).toBe(WEEKDAYS[new Date().getDay()]);
  });
});

describe('selectDailyMovementQuest', () => {
  test('is deterministic for a given date', () => {
    const a = selectDailyMovementQuest('8-10', profile, {
      date: new Date('2026-07-23'),
    });
    const b = selectDailyMovementQuest('8-10', profile, {
      date: new Date('2026-07-23'),
    });
    expect(a.id).toBe(b.id);
  });
});

describe('buildLocalPlan', () => {
  const plan = buildLocalPlan(profile, emptyPreferenceModel());

  test('returns a full Monday–Sunday week', () => {
    expect(plan).toHaveLength(7);
    expect(plan.map(d => d.day)).toEqual([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ]);
  });

  test("today's weekday row carries today's daily mission (regression: Thursday bug)", () => {
    const band = ageToBand(profile.childAge);
    // The child's daily mission = selectDailyMovementQuest for today.
    const todaysQuest = selectDailyMovementQuest(band, profile);
    const todayRow = plan.find(d => d.day === WEEKDAYS[new Date().getDay()]);

    expect(todayRow).toBeDefined();
    expect(todayRow!.activity.name).toBe(todaysQuest.title);
  });

  test('every activity resolves to a real quest with how-to guidance', () => {
    for (const day of plan) {
      const q = movementQuests.find(mq => mq.title === day.activity.name);
      expect(q).toBeDefined();
      expect(q!.warmUp).toBeTruthy();
      expect(q!.mainDrill).toBeTruthy();
      expect(q!.coolDown).toBeTruthy();
    }
  });
});
