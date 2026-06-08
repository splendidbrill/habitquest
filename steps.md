Supabase setup — auth, profiles, family linking, environment variables
Four pillar data model and sync layer — everything else depends on this
World Map UI — the visual centrepiece, highest impact on engagement
Pillar behaviour tracking — real metrics replacing app engagement metrics
Streak freeze + milestone rewards
Parent dashboard with real pillar data and family journey view
Family challenges and shared XP
Push notifications
Parent Barrier Solver (rule-based v1)
AI agent v1 — rule-based recommendations
Mystery box + variable rewards
AI agent v2 — GPT/DeepSeek powered personalisation
Family Adventure Mode
Photo rewards + file storage

//phases

Phase 1 canonical FamilyProfile + DB foundation → 2 layered onboarding → 3 food/activity swipe discovery → 4 Preference Engine ("Health DNA") → 5 Meal/Activity engine with the 70/20/10 rule → 6 "did everyone eat it?" feedback loops → 7 "why am I seeing this?" + healthy-swap rationale → 8 progressive micro-questions → 9 intro video → 10 parent dashboard DNA. Each phase lists exact files to touch, the data structures, and per-phase guardrails, plus a pre-PR anti-hallucination checklist.

build
cd android
./gradlew assembleRelease