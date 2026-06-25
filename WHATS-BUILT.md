# HabitQuest — What's Been Built (Phases A–F)

**The big picture:** HabitQuest went from a set of screens with hardcoded,
mismatched data into a single connected system — one shared meal plan, one scoring
engine, and one progress pipeline feeding both the parent and all three kids'
interfaces. Phases A–F delivered the data backbone, parent tools, meal/movement
intelligence, the unified kids experience, and the behaviour-change framework.

---

## Foundation — shared data layer

The root cause of most reported bugs was that every screen invented its own data.
That's now fixed:

- **Single source of truth for the weekly meal plan** (`weeklyPlanStore`). The
  parent Home "Today's plan", the parent Weekly Plan tab, and every child's
  "choose dinner" screen now all read the *same* plan. No more mismatches.
- **One scoring engine** (`pillarScore.ts`) that blends in-app activity (50%) with
  real-world weekly check-in data (50%) into four pillar scores: Nutrition,
  Movement, Sleep, Confidence.
- **One progress pipeline** (`streakService` / `syncService`): completing any
  mission writes a completion record, advances the streak + XP (idempotent — once
  per day, so it can't be gamed), and refreshes the parent dashboard.

---

## Phase A — Shared data backbone

- **Shared weekly meal plan** wired end-to-end (parent + all kids).
- **Avatar persistence**: children no longer re-pick their adventure buddy on every
  app open — it's saved per child profile and the selection flow is skipped on return.
- **Mission → progress wiring fixed**: completing a child mission now correctly
  updates the streak *and* the parent Progress tab (previously broken).

## Phase B — Parent quick wins

- Renamed **"Healthy Steps" → "HabitQuest"** across onboarding/welcome.
- **Ethnicity split**: "African/Caribbean" separated into "African" and
  "Caribbean", with downstream meal personalisation updated.
- **Home tab**: generic "Indian inspired meals" replaced with **"Meals
  personalised for your family"**; "Today's plan" now matches the actual weekly plan.
- **Plan tab copy fixes**: removed inaccurate price/cost; "all ate it" → "ate it
  all", "most did" → "ate most"; kept the leftover-from-yesterday feature; surfaced
  support & guidance links.

## Phase C — Meal & movement intelligence

- **Healthier-swap engine** (`healthierMeal.ts`): each meal now carries *why it's
  healthier* (non-shaming), an **age-adjusted portion guide** (hand-based —
  fists/palms for Adult / 6–8 / 8–10 / 10–12), 2–3 **"Small Wins"** upgrade
  suggestions, an icon-only nutrition snapshot (no calories), and a 👍/👌/👎 family
  feedback loop feeding personalisation.
- **Movement quest library** (`movementQuests.ts`): structured daily quests keyed
  by age band, personalised by favourite sports/equipment/indoor-outdoor and 👍/👎
  history, with positive framing (no weight-loss/punishment language) and links to
  NHS Healthier Families, Cosmic Kids, GoNoodle, BBC Super Movers.
- **Pantry Mode wired up**: parents tick foods they have; the engine builds meals
  from them and suggests what to add.

## Phase D — Unified kids experience (three age groups, one system)

The 8–10 (`kids8`) interface was rebuilt to the new Figma design, then became the
canonical template that 6–8 and 10–12 were rebuilt onto. **Same underlying system,
three skins** — only colours, copy, and character framing differ per age.

- **6–8 (`kids`)** — "adventure & imagination" theme: meals pull from the shared
  plan, avatar persists, streak updates on completion, **new mission rotates each
  day** (fixed the "come back tomorrow" dead end), and **Food Discovery + Veggie
  Explorer combined** into one auto-rotating weekly tile.
- **8–10 (`kids8`)** — athlete/sports theme: redesigned to the Figma layout (Home
  hub, World Map with 4 pillar regions, food/school tools, games).
- **10–12 (`kids12`)** — "autonomy/identity/mastery" theme: same structure,
  re-themed less cute/more epic, teen wellbeing content carried over.
- **Shared across all three:** avatar persistence, streak-on-completion, child
  meals = parent plan, daily movement quest from the shared library.

## Phase E — Parent tab consolidation & progress polish

- **Progress tab** now updates live when a child completes a mission (pillar scores
  + streak).
- **Parent tab** consolidated: all parent tools laid out directly **below the four
  health-pillar circles** instead of being buried behind sub-screens.

## Phase F — Behaviour-change framework (the §2.6 milestone)

Most of this had already accreted across A–E; Phase F completed it:

- **Family Health Dashboard** — four pillar % circles with this-week's-focus
  highlighting.
- **Family Journey / 6–8 week Adventure Mode** — phased journey (Build Foundations
  → Build Confidence → Master Habits) with a rotating weekly pillar focus and a
  family adventure map.
- **Parent Barrier Solver** — surfaced contextually (e.g. tapped straight from a
  "streak at risk" alert).
- **Family XP & parent→child awards** — family challenges + photo-based rewards.
- **Behaviour metrics** — weekly check-in captures fruit/veg days, active days,
  sleep hours, mood/confidence, etc., feeding the pillar scores.
- **NEW: Real-world mission logging** — a parent screen where you log things a child
  did *off* the app (played football, tried a new vegetable, went to bed on time).
  It flows through the exact same streak/XP/pillar pipeline as in-app missions, with
  quick-pick activities across all four pillars, a custom free-text option, and a
  milestone celebration when a streak hits 7/30/100 days.

---

## Net effect for the user

A parent and their kids now see one consistent, connected picture — the meals
match, progress flows from the child's actions (in-app *and* real-world) up to the
parent dashboard, scores reflect real behaviour, and each age group gets an
experience pitched right for them.

## Honest status notes

- The kids 6–8/10–12 rebuilds and some Phase E/F work are in the working tree and
  may not all be committed yet — worth a clean commit + device test pass before any
  demo.
- Content (healthier swaps, portions, movement quests) currently ships from a
  **curated static library**, not a live AI endpoint — an intentional "ship first,
  wire AI later" decision (open question #5 in the refinement plan).
