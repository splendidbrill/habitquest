# HabitQuest — Plan of Action (Interface Refinements)

> Source inputs: original change request, 8–10yo Figma prototype (used `kids8`
> screens as the in-code template — Figma URL was access-gated), and the three
> docx briefs: *Optimal Exercise Plans*, *Optimal Meal Plans*, *Refinement & Additions*.

## 0. Guiding principles & blockers

- **Single source of truth for meal plans.** One shared weekly meal plan feeds the
  parent Home "Today's plan", the parent Weekly Plan tab, AND every child's
  "choose dinner" screen. Today they each hardcode their own meals — that is the
  root cause of the mismatches.
- **One template for all three kid interfaces.** The 8–10 (`kids8`) interface is
  **first updated to match the new Figma prototype + WhatsApp hand-drawn layout**,
  and that updated version becomes the canonical structure. `kids` (6–8) and
  `kids12` (10–12) are then rebuilt to the same screen-for-screen layout. Only
  theme/colour/copy/content differs per age (per Refinement.docx "same system,
  different framing").
- **Figma received (unblocked).** Exported as a full React/Vite/shadcn code bundle
  in `/8-10yo`. The new 8–10 design is now fully specced in §3.1. The existing RN
  `kids8` screens must be **reworked to match this bundle** (ported web→React Native),
  then that becomes the template the other ages copy. WhatsApp hand-drawn layout still
  to be reconciled against it. Phases A–C don't depend on this and can proceed now.
- **Persistence:** avatars and per-day state must persist per child profile, not
  reset each launch.

---

## 1. Foundation / shared data layer (do first — everything depends on it)

### 1.1 Shared weekly meal plan
- Create a single weekly plan generator (extend existing `services/mealEngine.ts` +
  `data/mealLibrary.ts`) returning `{ day, meal, why, portions, upgrades, nutrition }`
  for Mon–Sun, personalised from onboarding.
- **Parent Home "Today's plan"** (`Home.tsx:64-89`) → replace the
  `indianRecipes[date % len]` logic with "today's entry from the shared plan".
- **Parent Weekly Plan** already uses `selectMeals()` — point it at the same generator.
- **Child dinner screens** (`KidsDinnerChoice`, `Kids8DinnerChoice`, `Kids12*`) →
  meal options come from the same shared plan (the day's planned meal + alternates),
  not local hardcoded arrays.

### 1.2 Meal "healthier swap" engine (from *Optimal Meal Plans* docx)
Every meal record gains, surfaced in the parent meal-details drawer:
1. **Why this version is healthier** (≤60 words, vs the common version, never shaming).
2. **Age-adjusted portion guide** (hand-based: fists/palms; Adult / 6–8 / 8–10 / 10–12).
3. **2–3 "Small Wins" upgrade suggestions** ("add peas", "wholewheat pasta"…).
4. **Nutrition snapshot** (icons only: 🟢/🟡 protein, veg, fibre, fats — no calories).
5. **Family feedback loop** (👍 Loved it / 👌 Okay / 👎 Not a fan) feeding personalisation.
- Recipe base framed around NHS Healthier Families / BBC Good Food / Eatwell;
  formula 70% familiar / 20% healthier swap / 10% exploration.

### 1.3 Movement quest library (from *Optimal Exercise Plans* docx)
- New `data/movementQuests.ts`: structured quests keyed by age band (6–8 / 8–10 /
  10–12), each with title, theme, challenge, equipment, duration, optional upgrade,
  XP, skills, "why this matters".
- AI/selector personalises by favourite sports, equipment, indoor/outdoor, 👍/👎 history
  (70/20/10 weighting described in docx). Daily Movement Quest surfaces on parent
  Weekly Plan (activity line) and on each child's daily mission.
- Include "Want extra inspiration?" links (NHS Healthier Families, Cosmic Kids, GoNoodle,
  BBC Super Movers). Avoid weight-loss/calorie/punishment language.

### 1.4 Avatar persistence (all child interfaces)
- **Children must never be asked to choose/create their avatar (adventure buddy) again
  on app open** once they have one. Persist the created/selected avatar against the
  child profile (`ChildContext` + `storage`, keyed by child id).
- Gate avatar selection screens: if `activeChild.avatar` exists, skip
  selection/customise and go straight to the home/dashboard for that age group.
- Applies to all three age groups (`KidsAvatarSelection`, `kids8` onboarding/personalisation,
  `kids12` profile/identity).

### 1.5 Pillar scoring & mission→progress wiring (from Refinement.docx)
- Ensure every mission/quest maps to a pillar (Nutrition / Movement / Sleep / Confidence).
- **Fix:** completing a child mission must update streak AND the parent Progress tab
  (currently doesn't — see 2.4 / 3.x). Wire mission completion → `pillarScore` /
  `streakService` → parent dashboard refresh.

---

## 2. Parent interface

### 2.1 Onboarding
- **Rename "Healthy Steps" → "HabitQuest"** (`Onboarding.tsx`, also check `Welcome.tsx`).
- **Split ethnicity** "African/Caribbean" (`Onboarding.tsx:153`) into two separate
  options: **"African"** and **"Caribbean"**. Update any downstream
  personalisation/meal matching that keys on the combined value.

### 2.2 Home tab (`Home.tsx`)
- **Recipe library personalisation:** replace generic "Indian inspired family meals"
  heading with **"Meals personalised for your family"**; populate from the curated/
  personalised recipe base (NHS/BBC etc.) using onboarding answers.
- **"Today's plan" must equal the weekly plan** for that day (see 1.1) — no more
  generic standalone recipe (e.g. "cooling cucumber raita") unrelated to the plan.

### 2.3 Plan tab (`WeeklyPlan.tsx`) — "keep the constant feedback, it's liked"
- **Remove the price/cost point** from each meal (inaccurate).
- **Fix copy:** "all ate it" → **"ate it all"**; "most did" → **"ate most"**.
- **Add "How to make this meal healthier"** AI-driven suggestions per meal
  (the Small Wins / healthier-swap content from 1.2) — e.g. "add extra veg to bulk it out".
- **Keep** the leftover-from-yesterday plan feature (explicitly liked).
- **Add support & guidance links** at the bottom of the Weekly Plan tab (the pages
  currently buried in the Parent tab — surface them here too).

### 2.4 Progress tab (`Progress.tsx`)
- **Fix:** does not update when a child completes a mission. Subscribe to / refresh
  on child mission completion and reflect pillar scores + streak (ties to 1.5).

### 2.5 Parent tab (`ParentHome.tsx`)
- **Move all parent tools into the main Parent tab**, laid out **below the health
  pillars** (consolidate the detail screens currently reached indirectly).
- **Pantry Mode:** `PantryMode.tsx` already exists but isn't surfaced/working as
  expected — wire it into the Parent tab. Parents tick foods they have; AI builds
  meals from them and suggests what to add to complete a meal (connect to mealEngine).

### 2.6 (Phase 2, from Refinement.docx — flag for decision)
- Family Health Dashboard (4 pillar % circles), Family Journey / 6–8 week Adventure
  Mode, Parent Barrier Solver (`BarrierSolver` exists), family XP & parent→child
  awards, real-world mission logging, behaviour metrics (fruit/veg/active days/sleep).

---

## 3. Child interfaces — unify on the 8–10 (kids8) template

### 3.1 Template unification

> **Figma received.** Exported as a full React/Vite/shadcn code bundle in `/8-10yo`
> (not images). This is the canonical 8–10 design. Spec captured below.

#### Canonical 8–10 structure (from `/8-10yo/src/app`)
- **Home hub** (`pages/Home.tsx`): header (round avatar → `/avatar`, name + level,
  streak + coins pills) · XP progress bar card · animated **buddy card** (e.g. "Sparky
  the Dragon") · **Today's Adventures** quest preview (→ Quests) · grouped tile sections
  **🎮 Games**, **🍎 Food Adventures** (Foods I Tried, Choose Dinner, Veggie Week,
  Kitchen Helper), **🎒 School Tools** (Lunch Builder, Snack Swaps, School Fuel) ·
  "Start Today's Adventure" CTA → Map · **5-item bottom nav: Home / Map / Games /
  Quests / Rewards**.
- **World Map** (`pages/WorldMap.tsx`): four pillar regions on an animated map —
  🥕 Nutrition Forest, ⚽ Activity Arena, 😴 Sleep Mountain, 🧠 Confidence Castle —
  each with % progress, star rating, lock state. This is the pillar hub from Refinement.docx.
- **Pillar pages**: NutritionForest, ActivityArena, SleepMountain, ConfidenceCastle.
- **Food**: ChooseDinner, FoodTracker ("Foods I Tried"), VeggieWeek, KitchenHelper,
  LunchBuilder, SnackSwap, SchoolFuel, DailyQuests, EnergyMeter.
- **Engagement**: Rewards, GameHub + games (FruitSnake, JungleRunner, SuperheroWorkout,
  MiniGame), Profile, AvatarCreator.
- **Theme tokens** (`/8-10yo/src/styles/theme.css`): bg `#FFF5F0`, fg `#2D1B4E`,
  primary purple `#8B5CF6`, secondary gold `#FCD34D`, accent pink `#F472B6`,
  radius `1rem`; pillar colours nutrition `#10B981`, activity `#3B82F6`,
  sleep `#8B5CF6`, confidence `#F59E0B`, xp-bar `#EC4899`. Heavy use of
  gradients + `motion/react` animations.

#### Work
- **Step 0:** rework the existing RN `kids8` screens to match the above structure +
  theme (port from the web bundle to React Native; replace `react-router` Links with
  RN navigation, `motion/react` with `react-native-reanimated`/Animated, tailwind
  classes with the RN `theme.ts`). Reconcile with the WhatsApp hand-drawn layout.
  Sign off before propagating.
- This updated `kids8` is the canonical template all other ages copy.
- **Replace the 10–12 (`kids12`) interface** so it uses the **same structure** as
  kids8, re-themed for 10–12 ("autonomy/identity/mastery" — less cute, more epic;
  Refinement.docx). Keep its wellbeing/teen content but in the unified layout.
- Rebuild **6–8 (`kids`)** to the same structure, themed "adventure & imagination"
  (buddy/characters; "Help Bunny find an orange food" framing).
- Same underlying system, three skins (copy + colours + character framing only).

### 3.2 Shared fixes across ALL kid ages
- **Avatar persistence** (1.4) — don't re-pick the buddy/avatar every login.
- **Streak updates on mission completion** (currently broken in 6–8 and 8–10).
- **Child meal plan = parent weekly plan** (1.1) — "choose dinner" options must be
  the parent plan's meals for that day.
- **Daily Movement Quest** from shared library (1.3), per age framing.

### 3.3 Children 6–8 (`kids`) — full checklist
> Complete list for the 6–8 interface (includes the shared fixes from 3.2, repeated
> here so this section is self-contained against the original request).
1. **Meal plan = parent interface** — child meals come from the shared weekly plan (1.1).
2. **Save the adventure buddy/avatar** — don't re-choose it every login; persist the
   created avatar per child profile (1.4).
3. **Streak updates when a mission is completed** — currently does not update; fix the
   completion → streak wiring (1.5).
4. **New mission on day 2+** — fix the "Mission complete – come back tomorrow" dead end;
   rotate to the next mission from the catalog each day.
5. **Combine "Food Discovery" + "Veggie Explorer" into one tile** — 5 new fruit/veg to
   discover per week, auto-rotating once per week, allowed to repeat items every few weeks.
6. **"Choose dinner" meals correspond to the parent weekly meal plan** (1.1).

### 3.4 Children 8–10 (`kids8`)
- **Rework to the new Figma + WhatsApp layout first** (3.1 Step 0) — this is a redesign
  of kids8, not just a re-use. Then apply shared fixes (3.2): confirm dinner choice
  pulls the shared plan; confirm streak/mission/progress wiring.

### 3.5 Children 10–12 (`kids12`)
- Replace structure with kids8 template (3.1); re-theme; carry over wellbeing content;
  apply shared fixes (3.2).

---

## 4. Suggested sequencing (phased)

1. **Phase A — Shared data backbone:** 1.1 meal plan single-source, 1.4 avatar
   persistence, 1.5 mission→progress/streak wiring. (Unblocks the most-reported bugs.)
2. **Phase B — Parent quick wins:** 2.1 rename + ethnicity split, 2.2 Home text +
   today's-plan parity, 2.3 Plan-tab copy fixes / remove price / support links.
3. **Phase C — Meal & movement intelligence:** 1.2 healthier-swap drawer + portions,
   1.3 movement quest library, 2.5 pantry mode wiring.
4. **Phase D — Kid template unification:** 3.1 unify kids12 + kids onto kids8, then
   per-age content (3.3–3.5).
5. **Phase E — Parent tab consolidation & progress polish:** 2.4, 2.5 layout.
6. **Phase F (optional, larger):** 2.6 behaviour-change framework from Refinement.docx.

---

## 5. Open questions / needs from you

1. **Figma frames** — share exported images/PDF of the 8–10 prototype so I can verify
   the in-code kids8 layout matches the latest design before unifying the others.
2. **Ethnicity split** — any other ethnicities to add/relabel while we're in there
   (e.g. should "South Asian" stay grouped)?
3. **kids12 content** — keep the existing teen wellbeing content (reflection, check-in,
   resources) within the unified layout, or replace with kids8-style content re-themed?
4. **Phase F scope** — is the behaviour-change framework (pillar dashboards, 6-week
   journeys, real-world mission logging) in scope now, or a later milestone?
5. **AI vs templated content** — for "healthier swaps", portion guides, and movement
   quests: ship from a curated static library first, or wire to a live AI endpoint now?
