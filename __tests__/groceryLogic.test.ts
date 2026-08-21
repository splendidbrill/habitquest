// Unit tests for the grocery list logic — covers ingredient categorisation and
// that the list is aggregated + de-duped from the weekly plan's meals.

import { categorize, buildItems } from '../src/services/groceryLogic';
import type { DayPlan } from '../src/services/weeklyPlanStore';

describe('categorize', () => {
  test.each([
    ['Chicken breast', 'Meat & Fish'],
    ['Whole milk', 'Dairy & Eggs'],
    ['Basmati rice', 'Pantry'],
    ['Frozen peas', 'Frozen'],
    ['Apple', 'Fruit'],
    ['Naan bread', 'Bakery'],
    ['Cumin seeds', 'Spices & Herbs'],
    ['Courgette', 'Fresh Produce'],
  ])('%s → %s', (name, expected) => {
    expect(categorize(name)).toBe(expected);
  });
});

const makeDay = (
  day: string,
  name: string,
  ingredients: string[],
): DayPlan => ({
  day,
  meal: { name, reason: '', time: '10 min', ingredients },
  activity: {
    name: 'x',
    description: '',
    duration: '10 min',
    pillar: 'movement',
  },
});

describe('buildItems', () => {
  test('aggregates and de-dupes ingredients across the week', () => {
    const plan = [
      makeDay('Monday', 'Pasta', ['Pasta', 'Onion', 'Tomatoes']),
      makeDay('Tuesday', 'Curry', ['Onion', 'Chicken', 'Rice']),
    ];
    const names = buildItems(plan).map(i => i.item.toLowerCase());

    // "Onion" is in both meals but should appear once.
    expect(names.filter(n => n === 'onion')).toHaveLength(1);
    expect(names).toEqual(
      expect.arrayContaining(['pasta', 'onion', 'tomatoes', 'chicken', 'rice']),
    );
  });

  test('categorises each item', () => {
    const items = buildItems([
      makeDay('Monday', 'Meal', ['Chicken', 'Rice', 'Frozen peas']),
    ]);
    const cat = (name: string) => items.find(i => i.item === name)?.category;

    expect(cat('Chicken')).toBe('Meat & Fish');
    expect(cat('Rice')).toBe('Pantry');
    expect(cat('Frozen peas')).toBe('Frozen');
  });
});
