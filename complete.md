What you need to do right now
Fill in .env with your Azure AI Foundry keys:

DEEPSEEK_AZURE_ENDPOINT=...
DEEPSEEK_AZURE_KEY=...
GPT41_AZURE_ENDPOINT=...
GPT41_AZURE_KEY=...
Run the SQL in Supabase SQL Editor (the block from the last message — 5 tables for Steps 13 & 14)
Create the Storage bucket — Supabase → Storage → New bucket → meal-photos → Public
Rebuild native after adding the image picker and permissions:
iOS: cd ios && pod install
Android: just rebuild — permissions are picked up automatically
App flow

Sign up / Sign in
       ↓
Role Selection (Parent or Child?)
       ↓
   PARENT                          CHILD
     ↓                               ↓
Onboarding                    Age group selection
     ↓                          6-8 | 8-10 | 10-12
Main app (4 tabs)                      ↓
Home / Plan /               Age-specific onboarding
Progress / Parent               (avatar, sport, name)
     ↓                               ↓
Family linking              Age-specific home screen
via family code                        ↓
                              Daily loop:
                            Morning check-in
                                  ↓
                            Mission drop
                                  ↓
                            Complete mission
                                  ↓
                          Success celebration
                                  ↓
                           Mystery box open
                                  ↓
                        Back to home screen
                       (Daily Spin shows once/day)
Family features run across both sides: parent creates challenges/adventures, kids complete them, parent reacts with emoji, kids see the reaction.

The agent system
Yes — there are two agents tracking everything.

What gets tracked continuously from day 1:

Every mission completed (which pillar, when, XP earned)
Every food interaction (tried / liked / skipped / repeated)
Mood and energy check-ins (10-12 age group)
Game scores
Streak data
Weekly pillar check-ins (nutrition days, active days, sleep hours, etc.)
Agent v1 — rule-based (recommendationService.ts)

Kicks in immediately from day 1. No minimum data needed. Uses:

This week's focus pillar (rotates weekly)
Weakest pillar from Supabase scores
Mission completions in last 3 days (penalises repeats)
Liked/skipped food tags (boosts or penalises matching missions)
Outputs: top 3 scored missions shown in RecommendedMissions on every home screen.

Agent v2 — AI-powered (DeepSeek + GPT-4.1)

Kicks in as soon as the Azure keys are set, but needs data to be useful. The app always tries AI first and silently falls back to v1 if the API fails or there's not enough history.

For the child (DeepSeek) — reads the last 7 days:

Mission completions
Food likes and avoids
Mood trend (aggregated, not raw — for 10-12)
Focus and weakest pillar
What it does: picks 3 missions from the catalog with a short, age-appropriate personalised reason. A 6-8 year old who keeps skipping vegetables might get "You've been avoiding veg — this one's quick and you pick the colour!" rather than a generic label.

For the parent (GPT-4.1) — reads the last 7 days:

All missions completed that week
Foods tried vs avoided
All 4 pillar scores
Mood trend summary (10-12 only, never raw entries)
What it does: writes a Weekly Insight card on the parent dashboard — a 2-sentence summary of the week, 2-3 patterns spotted, one specific actionable suggestion, and any alerts (streak at risk, low pillar score, consistent avoidance).

In practice — how long before it gets meaningfully personalised:

Usage	What the AI knows
Day 1-2	Almost nothing → falls back to rule-based
Day 3-5	Food preferences start emerging, mission patterns visible
7 days	First full parent digest. AI recommendations start diverging from generic
14+ days	Strong food profiles, streak patterns, mood trends (10-12). Recommendations become genuinely individual
The longer a child uses it, the more the AI diverges from the rule-based baseline — which is the long-term retention mechanic. A child who's been using it for a month gets recommendations that feel like they know them personally.