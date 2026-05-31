import { supabase } from '../lib/supabase';
import catalog, { type Adventure } from '../data/adventureCatalog';

export type AdventureContribution = {
  stageIndex: number;
  contributorId: string;
  contributorType: 'parent' | 'child';
  contributorName: string;
  completedAt: string;
};

export type ActiveAdventure = {
  dbId: string;
  adventureId: string;
  currentStage: number;
  status: 'active' | 'complete' | 'abandoned';
  startedAt: string;
  completedAt: string | null;
  adventure: Adventure;
  contributions: AdventureContribution[];
};

export async function getActiveAdventure(parentId: string): Promise<ActiveAdventure | null> {
  const { data } = await supabase
    .from('family_adventures')
    .select('*')
    .eq('parent_id', parentId)
    .eq('status', 'active')
    .order('started_at', { ascending: false })
    .limit(1)
    .single();

  if (!data) return null;

  const adventure = catalog.find(a => a.id === data.adventure_id);
  if (!adventure) return null;

  const { data: contribs } = await supabase
    .from('adventure_contributions')
    .select('*')
    .eq('adventure_id', data.id);

  return {
    dbId: data.id,
    adventureId: data.adventure_id,
    currentStage: data.current_stage,
    status: data.status,
    startedAt: data.started_at,
    completedAt: data.completed_at ?? null,
    adventure,
    contributions: (contribs ?? []).map(c => ({
      stageIndex: c.stage_index,
      contributorId: c.contributor_id,
      contributorType: c.contributor_type,
      contributorName: c.contributor_name,
      completedAt: c.completed_at,
    })),
  };
}

export async function startAdventure(parentId: string, adventureId: string): Promise<string | null> {
  await supabase
    .from('family_adventures')
    .update({ status: 'abandoned' })
    .eq('parent_id', parentId)
    .eq('status', 'active');

  const { data } = await supabase
    .from('family_adventures')
    .insert({ parent_id: parentId, adventure_id: adventureId, current_stage: 0, status: 'active' })
    .select('id')
    .single();

  return data?.id ?? null;
}

export async function contributeToStage(
  adventureDbId: string,
  stageIndex: number,
  contributorId: string,
  contributorType: 'parent' | 'child',
  contributorName: string,
): Promise<void> {
  await supabase.from('adventure_contributions').upsert(
    {
      adventure_id: adventureDbId,
      stage_index: stageIndex,
      contributor_id: contributorId,
      contributor_type: contributorType,
      contributor_name: contributorName,
      completed_at: new Date().toISOString(),
    },
    { onConflict: 'adventure_id,stage_index,contributor_id' },
  );
}

export async function tryAdvanceStage(
  active: ActiveAdventure,
  childIds: string[],
): Promise<'advanced' | 'complete' | 'waiting'> {
  const stageCont = active.contributions.filter(c => c.stageIndex === active.currentStage);
  const parentDone = stageCont.some(c => c.contributorType === 'parent');
  const allKidsDone = childIds.length === 0 || childIds.every(id => stageCont.some(c => c.contributorId === id));

  if (!parentDone || !allKidsDone) return 'waiting';

  const isLast = active.currentStage >= active.adventure.stages.length - 1;

  if (isLast) {
    await supabase
      .from('family_adventures')
      .update({ status: 'complete', completed_at: new Date().toISOString() })
      .eq('id', active.dbId);
    return 'complete';
  }

  await supabase
    .from('family_adventures')
    .update({ current_stage: active.currentStage + 1 })
    .eq('id', active.dbId);
  return 'advanced';
}

export async function getChildParentId(childId: string): Promise<string | null> {
  const { data } = await supabase
    .from('children')
    .select('parent_id')
    .eq('id', childId)
    .single();
  return data?.parent_id ?? null;
}

export async function getChildrenForParent(parentId: string): Promise<{ id: string; name: string }[]> {
  const { data } = await supabase
    .from('children')
    .select('id, name')
    .eq('parent_id', parentId);
  return data ?? [];
}
