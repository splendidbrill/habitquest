# ============================================================
# Generates src/data/mealDatabase.ts and src/data/activityDatabase.ts
# from the two source spreadsheets (via the _meals.json / _activities.json
# row dumps produced by _extract.py).
#
# Run from the repo root:  python "meals and exercise plan/generate-data.py"
#
# The spreadsheets remain the single source of truth — re-run this whenever
# the sheets change. NOTE: per the app's non-shaming guardrail, calorie figures
# are stored but never surfaced in the UI (see services/healthierMeal.ts).
# ============================================================
import json, re, io, os

BASE = "meals and exercise plan/"
OUT = "src/data/"

meals = json.load(open(BASE + "_meals.json", encoding="utf-8"))
acts = json.load(open(BASE + "_activities.json", encoding="utf-8"))


def js(value):
    """Serialise a Python value to a TS literal (JSON is valid TS)."""
    return json.dumps(value, ensure_ascii=False)


def lines(text):
    """Split a multi-line cell into clean, number-stripped lines."""
    out = []
    for ln in (text or "").replace("\r", "\n").split("\n"):
        ln = ln.strip()
        if not ln:
            continue
        ln = re.sub(r"^\d+[\.\)]\s*", "", ln)  # drop leading "1. " / "1) "
        out.append(ln)
    return out


# ─────────────────────────── MEALS ───────────────────────────

CUISINE_RULES = [
    ("Caribbean", ["caribbean", "jamaican", "tropical"]),
    ("African", ["west african", "ethiopian", "east african"]),
    ("Mexican", ["mexican", "latin american", "brazilian"]),
    ("Chinese", ["chinese", "east asian", "japanese", "vietnamese", "thai",
                 "filipino", "korean", "indonesian"]),
    ("Indian", ["south asian", "punjabi", "indian", "sri lankan"]),
    ("Middle Eastern", ["middle eastern", "persian", "iranian", "turkish",
                        "north african", "moroccan", "egyptian"]),
    ("Italian", ["italian"]),
    ("Mediterranean", ["mediterranean", "greek", "spanish", "french"]),
]


def to_cuisine(tags):
    t = (tags or "").lower()
    for cuisine, keys in CUISINE_RULES:
        if any(k in t for k in keys):
            return cuisine
    return "British"


def prep_band(mins):
    try:
        m = int(float(mins))
    except (TypeError, ValueError):
        return "15-30"
    if m <= 14:
        return "under15"
    if m <= 29:
        return "15-30"
    if m <= 44:
        return "30-45"
    return "45plus"


def budget_band(cost):
    c = (cost or "")
    if "£££" in c:
        return "high"
    if "££" in c:
        return "medium"
    return "low"


KID_WORDS = ["mild", "sweet", "cheesy", "pasta", "pizza", "burger", "wrap",
             "quesadilla", "pancake", "lolly", "nugget", "bites", "oat", "bar"]
GROWN_WORDS = ["spicy", "herby", "salad", "soup", "tagine", "niçoise",
               "nicoise", "caesar", "curry goat", "adobo", "souvlaki"]


def child_friendliness(name, flavour, occasion):
    text = (name + " " + flavour).lower()
    score = 4
    if occasion == "Snack" or any(w in text for w in KID_WORDS):
        score = 5
    if any(w in text for w in GROWN_WORDS):
        score = 3
    return score


PORK_WORDS = ["pork", "bacon", "ham", "chorizo", "pancetta", "lardon", "gammon"]
# Ingredient-level allergen detection — a conservative safety net so the hard
# dietary filter never misses an allergen the sheet's allergen column omitted.
GLUTEN_WORDS = ["pasta", "flour", "bread", "wrap", "tortilla", "naan", "roti",
                "chapati", "chapatti", "pitta", "pita", "noodle", "couscous",
                "barley", "soba", "breadcrumb", "bagel", "lasagne", "bun",
                "cracker", "pastry", "soy sauce"]
# 'milk'/'cream' deliberately excluded — they false-positive on coconut/plant
# milk; the sheet's allergen column reliably lists Milk/Dairy for real dairy.
DAIRY_WORDS = ["cheese", "butter", "yoghurt", "yogurt", "halloumi", "feta",
               "paneer", "mozzarella", "cheddar", "parmesan", "ghee"]
NUT_WORDS = ["peanut", "almond", "cashew", "walnut", "pecan", "hazelnut",
             "pistachio", "nut butter", "pesto"]


def clean_tag(t):
    t = t.strip().lower()
    t = t.replace("-based", "").replace("-forward", "")
    return t.strip()


def meal_tags(flavour, occasion, veg, vegan, quick):
    tags = []
    for t in (flavour or "").split(","):
        t = clean_tag(t)
        if t:
            tags.append(t)
    tags.append(occasion.lower())
    if veg:
        tags.append("vegetarian")
    if vegan:
        tags.append("vegan")
    if quick:
        tags.append("quick")
    seen, out = set(), []
    for t in tags:
        if t and t not in seen:
            seen.add(t)
            out.append(t)
    return out[:7]


def num(v, default=0.0):
    try:
        return float(v)
    except (TypeError, ValueError):
        return default


meal_objs = []
for m in meals:
    diet = (m.get("dietary_requirement_tags") or "")
    diet_l = diet.lower()
    allerg = (m.get("allergens_present") or "")
    allerg_l = allerg.lower()
    ing = (m.get("ingredients_list") or "").lower()
    veg = "vegetarian" in diet_l or "vegan" in diet_l
    vegan = "vegan" in diet_l
    occasion = m.get("meal_occasion") or "Dinner"
    pb = prep_band(m.get("cook_time_minutes_exact"))
    quick = pb in ("under15", "15-30")
    halal = "halal" in diet_l or "no pork" in diet_l
    pork = (not halal) and any(w in ing for w in PORK_WORDS)

    obj = {
        "id": m.get("meal_id"),
        "name": m.get("meal_name"),
        "cuisine": to_cuisine(m.get("cultural_cuisine_tags")),
        "occasion": occasion,
        "prepBand": pb,
        "budget": budget_band(m.get("cost_band")),
        "childFriendliness": child_friendliness(
            m.get("meal_name", ""), m.get("flavour_food_tags", ""), occasion),
        "tags": meal_tags(m.get("flavour_food_tags"), occasion, veg, vegan, quick),
        "ingredients": lines(m.get("ingredients_list")),
        "vegetarian": veg,
        "containsDairy": ("milk/dairy" in allerg_l or any(w in ing for w in DAIRY_WORDS)) and not vegan,
        "containsNuts": ("tree nut" in allerg_l or "peanut" in allerg_l or any(w in ing for w in NUT_WORDS)),
        "containsGluten": ("gluten" in allerg_l or any(w in ing for w in GLUTEN_WORDS)),
        "containsPork": pork,
        # rich
        "cuisines": [c.strip() for c in (m.get("cultural_cuisine_tags") or "").split(",") if c.strip()],
        "method": lines(m.get("recipe_method")),
        "portions": {
            "age6to8": m.get("portion_guide_child_6_8") or "",
            "age8to10": m.get("portion_guide_child_8_10") or "",
            "age10to12": m.get("portion_guide_child_10_12") or "",
            "adult": m.get("portion_guide_adult") or "",
        },
        "whyHealthier": m.get("why_healthy_base_explanation") or "",
        "healthySwap": m.get("healthy_swap_description") or "",
        "furtherSwap": m.get("further_swap_suggestion") or "",
        "nutrition": {
            "kcal": round(num(m.get("kcal_per_portion"))),
            "protein": round(num(m.get("protein_g_per_portion")), 1),
            "fibre": round(num(m.get("fibre_g_per_portion")), 1),
            "satFat": round(num(m.get("saturated_fat_g_per_portion")), 1),
            "sugar": round(num(m.get("sugar_g_per_portion")), 1),
            "salt": round(num(m.get("salt_g_per_portion")), 1),
        },
        "cookTimeMin": int(num(m.get("cook_time_minutes_exact"))),
        "equipment": [e.strip() for e in (m.get("equipment_needed") or "").split(",") if e.strip()],
        "allergens": [a.strip() for a in allerg.split(",") if a.strip() and a.strip().lower() != "none"],
    }
    meal_objs.append(obj)


# ───────────────────────── ACTIVITIES ─────────────────────────

EMOJI = {
    "Football": "⚽", "Basketball": "🏀", "Tennis": "🎾", "Dance": "💃",
    "Yoga/Mindful Movement": "🧘", "Athletics/Running": "🏃",
    "Martial Arts-Inspired": "🥋", "Gymnastics": "🤸", "Cricket": "🏏",
    "Rugby": "🏉", "Netball": "🏐", "Cycling": "🚲",
    "Swimming (land-based prep)": "🏊", "Obstacle/Ninja Course": "🥷",
    "Art-Linked Movement": "🎨", "Music-Linked Movement": "🎵",
    "General Fitness/No Sport Preference": "💪",
}
THEME = {
    "General Fitness/No Sport Preference": "Move & Play",
    "Yoga/Mindful Movement": "Mindful Movement",
    "Martial Arts-Inspired": "Martial Arts",
    "Obstacle/Ninja Course": "Ninja Course",
    "Athletics/Running": "Athletics",
    "Art-Linked Movement": "Art & Movement",
    "Music-Linked Movement": "Music & Movement",
    "Swimming (land-based prep)": "Swim Prep",
}
SKILL = {
    "cardiovascular endurance": "cardio",
    "balance and coordination": "balance",
    "fine motor / ball skill": "ball skill",
    "muscular strength": "strength",
    "agility and speed": "agility",
    "flexibility": "flexibility",
    "bone-strengthening (impact)": "bone strength",
}

id_to_name = {a.get("activity_id"): a.get("activity_name") for a in acts}


def parse_bands(s):
    s = (s or "").lower()
    if "all ages" in s:
        return ["6-8", "8-10", "10-12"]
    bands = []
    for b in ["6-8", "8-10", "10-12"]:
        if b in s:
            bands.append(b)
    return bands or ["8-10"]


def skills_from(comp):
    out = []
    for c in (comp or "").split(","):
        key = c.strip().lower()
        label = SKILL.get(key)
        if not label:
            label = key.split("/")[0].split("(")[0].strip()
        if label and label not in out:
            out.append(label)
    return out[:3]


def act_tags(cat, space, equip, fitness, intensity):
    t = set()
    cat_l = cat.lower()
    sp = (space or "").lower()
    eq = (equip or "").lower()
    fit = (fitness or "").lower()
    inten = (intensity or "").lower()
    sport_map = {
        "football": "football", "basketball": "basketball", "tennis": "tennis",
        "cricket": "cricket", "rugby": "rugby", "netball": "netball",
    }
    for key, tag in sport_map.items():
        if key in cat_l:
            t.add(tag)
            t.add("sport")
            t.add("ball")
    if "dance" in cat_l:
        t.add("dance")
    if "music" in cat_l:
        t.add("music")
    if "yoga" in cat_l or "mindful" in cat_l:
        t.update(["yoga", "mindfulness", "calm"])
    if "martial" in cat_l:
        t.add("martial arts")
    if "running" in cat_l or "athletics" in cat_l:
        t.add("running")
    if "cycling" in cat_l:
        t.add("cycling")
    if "swimming" in cat_l:
        t.add("swimming")
    if "ninja" in cat_l or "obstacle" in cat_l:
        t.add("agility")
    if "ball" in eq or any(s in eq for s in ["football", "basketball", "tennis", "cricket", "netball", "rugby"]):
        t.add("ball")
    if "skipping" in eq or "rope" in eq:
        t.add("skipping")
    if "bike" in eq or "scooter" in eq or "cycl" in eq:
        t.add("bike")
    if "strength" in fit:
        t.add("strength")
    if "cardio" in fit or "vigorous" in inten:
        t.add("cardio")
    if "indoor" in sp:
        t.add("indoor")
    if "garden" in sp or "park" in sp or "outdoor" in sp:
        t.add("outdoor")
    if "any space" in sp:
        t.update(["indoor", "outdoor"])
    return sorted(t)


def xp_for(mins, intensity):
    base = 10 + round(mins * 0.7)
    inten = (intensity or "").lower()
    if "vigorous" in inten:
        base += 6
    elif "mixed" in inten:
        base += 4
    elif "moderate" in inten:
        base += 2
    return max(15, min(40, base))


act_objs = []
for a in acts:
    cat = a.get("interest_category") or "General Fitness/No Sport Preference"
    space = a.get("space_required") or ""
    sp_l = space.lower()
    mins = int(num(a.get("duration_minutes_exact"), 10))
    next_id = a.get("progression_next_activity_id") or ""
    has_next = next_id.startswith("ACT-")
    next_name = id_to_name.get(next_id) if has_next else None
    step_raw = a.get("progression_step") or ""

    obj = {
        "id": a.get("activity_id"),
        "ageBands": parse_bands(a.get("age_band_suitability")),
        "title": a.get("activity_name"),
        "emoji": EMOJI.get(cat, "💪"),
        "theme": THEME.get(cat, cat),
        "challenge": (a.get("main_drill_instructions") or "").strip(),
        "equipment": a.get("equipment_needed") or "None",
        "durationMin": mins,
        "xp": xp_for(mins, a.get("intensity_band")),
        "skills": skills_from(a.get("primary_fitness_component")),
        "whyMatters": (a.get("what_this_builds_explanation") or "").strip(),
        "indoor": ("indoor" in sp_l) or ("any space" in sp_l),
        "outdoor": ("garden" in sp_l) or ("park" in sp_l) or ("outdoor" in sp_l) or ("any space" in sp_l),
        "tags": act_tags(cat, space, a.get("equipment_needed"),
                         a.get("primary_fitness_component"), a.get("intensity_band")),
        # rich
        "warmUp": (a.get("warm_up_instructions") or "").strip(),
        "mainDrill": (a.get("main_drill_instructions") or "").strip(),
        "coolDown": (a.get("cool_down_instructions") or "").strip(),
        "whatBuilds": (a.get("what_this_builds_explanation") or "").strip(),
        "coachingTips": {
            "age6to8": (a.get("coaching_tip_6_8") or "").strip(),
            "age8to10": (a.get("coaching_tip_8_10") or "").strip(),
            "age10to12": (a.get("coaching_tip_10_12") or "").strip(),
        },
        "intensity": a.get("intensity_band") or "",
        "progressionFamily": a.get("progression_family") or "",
        "parentSetup": (a.get("parent_setup_notes") or "").strip(),
        "safety": (a.get("safety_notes") or "").strip(),
        "occasion": a.get("activity_occasion") or "",
    }
    try:
        obj["progressionStep"] = int(float(step_raw))
    except (TypeError, ValueError):
        pass
    if has_next:
        obj["progressionNextId"] = next_id
        if next_name:
            obj["progressionNextName"] = next_name
            obj["upgrade"] = "Smash this stage to unlock: " + next_name
    act_objs.append(obj)


# ─────────────────────────── EMIT TS ───────────────────────────

def emit_obj(o, order):
    parts = []
    for k in order:
        if k not in o:
            continue
        parts.append(f"    {k}: {js(o[k])},")
    return "  {\n" + "\n".join(parts) + "\n  }"


MEAL_ORDER = ["id", "name", "cuisine", "occasion", "prepBand", "budget",
              "childFriendliness", "tags", "ingredients", "vegetarian",
              "containsDairy", "containsNuts", "containsGluten", "containsPork",
              "cuisines", "method", "portions", "whyHealthier", "healthySwap",
              "furtherSwap", "nutrition", "cookTimeMin", "equipment", "allergens"]

meal_header = '''// ============================================================
// Meal Database — generated from "HabitQuest Meal Database.xlsx".
// DO NOT EDIT BY HAND. Regenerate via:
//   python "meals and exercise plan/generate-data.py"
//
// 100 dietitian-reviewed meals with full recipes, age-specific portions,
// authored "why healthier" + healthy-swap copy and real nutrition figures.
// `mealLibrary` is the LibraryMeal-shaped view the Meal Engine selects from;
// the extra DatabaseMeal fields drive the parent meal detail + recipe view.
//
// Guardrail: nutrition.kcal is stored but MUST NOT be surfaced as a figure —
// the app uses an icon-only 🟢/🟡 snapshot (no calories / no shaming).
// ============================================================

import type { Cuisine, PrepBand, Budget } from './mealArchetypes';

export type MealOccasion = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface LibraryMeal {
  id: string;
  name: string;
  cuisine: Cuisine;
  occasion: MealOccasion;
  prepBand: PrepBand;
  budget: Budget;
  childFriendliness: number; // 1 (adventurous) … 5 (very kid-friendly)
  tags: string[];
  ingredients: string[];
  // Hard dietary flags — used as filters, never as ranking signal.
  vegetarian: boolean;
  containsDairy: boolean;
  containsNuts: boolean;
  containsGluten: boolean;
  containsPork: boolean;
}

export interface MealPortions {
  age6to8: string;
  age8to10: string;
  age10to12: string;
  adult: string;
}

export interface MealNutrition {
  kcal: number; // stored only; never shown as a figure (guardrail)
  protein: number;
  fibre: number;
  satFat: number;
  sugar: number;
  salt: number;
}

export interface DatabaseMeal extends LibraryMeal {
  cuisines: string[]; // original cultural-cuisine tags
  method: string[];
  portions: MealPortions;
  whyHealthier: string;
  healthySwap: string;
  furtherSwap: string;
  nutrition: MealNutrition;
  cookTimeMin: number;
  equipment: string[];
  allergens: string[];
}

export const mealDatabase: DatabaseMeal[] = [
'''

meal_body = ",\n".join(emit_obj(o, MEAL_ORDER) for o in meal_objs)
meal_footer = '''
];

// LibraryMeal-shaped view for the Meal Engine (DatabaseMeal extends LibraryMeal).
export const mealLibrary: LibraryMeal[] = mealDatabase;
'''

with io.open(OUT + "mealDatabase.ts", "w", encoding="utf-8", newline="\n") as f:
    f.write(meal_header + meal_body + meal_footer)


ACT_ORDER = ["id", "ageBands", "title", "emoji", "theme", "challenge",
             "equipment", "durationMin", "upgrade", "xp", "skills",
             "whyMatters", "indoor", "outdoor", "tags", "warmUp", "mainDrill",
             "coolDown", "whatBuilds", "coachingTips", "intensity",
             "progressionFamily", "progressionStep", "progressionNextId",
             "progressionNextName", "parentSetup", "safety", "occasion"]

act_header = '''// ============================================================
// Activity Database — generated from "HabitQuest Activity Database.xlsx".
// DO NOT EDIT BY HAND. Regenerate via:
//   python "meals and exercise plan/generate-data.py"
//
// 100 PE/physio-style activities with warm-up / main drill / cool-down,
// what-it-builds, age-specific coaching tips and progression ladders.
// Typed as MovementQuest (see ./movementQuests) so the daily-quest selector
// and every child mission screen render this content with no other changes.
// ============================================================

import type { MovementQuest } from './movementQuests';

export const activityQuests: MovementQuest[] = [
'''

act_body = ",\n".join(emit_obj(o, ACT_ORDER) for o in act_objs)
act_footer = "\n];\n"

with io.open(OUT + "activityDatabase.ts", "w", encoding="utf-8", newline="\n") as f:
    f.write(act_header + act_body + act_footer)

print(f"Wrote {OUT}mealDatabase.ts ({len(meal_objs)} meals)")
print(f"Wrote {OUT}activityDatabase.ts ({len(act_objs)} activities)")
