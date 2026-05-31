import { supabase } from '../lib/supabase';

export const REACTION_EMOJIS = ['🔥', '❤️', '⭐', '💪', '🎉', '👏'] as const;

export type MissionReaction = {
  id: string;
  parentId: string;
  childId: string;
  missionTitle: string;
  emoji: string;
  seen: boolean;
  createdAt: string;
};

export type ReactionTarget = {
  childId: string;
  childName: string;
  missionTitle: string;
  completedAt: string;
  alreadyReacted: boolean;
};

export async function sendReaction(
  parentId: string,
  childId: string,
  missionTitle: string,
  emoji: string,
): Promise<void> {
  await supabase.from('mission_reactions').insert({
    parent_id: parentId,
    child_id: childId,
    mission_title: missionTitle,
    emoji,
    seen: false,
  });
}

export async function getUnseenReactions(childId: string): Promise<MissionReaction[]> {
  const { data } = await supabase
    .from('mission_reactions')
    .select('*')
    .eq('child_id', childId)
    .eq('seen', false)
    .order('created_at', { ascending: false })
    .limit(5);

  return (data ?? []).map(r => ({
    id: r.id,
    parentId: r.parent_id,
    childId: r.child_id,
    missionTitle: r.mission_title,
    emoji: r.emoji,
    seen: r.seen,
    createdAt: r.created_at,
  }));
}

export async function markReactionsSeen(childId: string): Promise<void> {
  await supabase
    .from('mission_reactions')
    .update({ seen: true })
    .eq('child_id', childId)
    .eq('seen', false);
}

export async function getReactionTargets(parentId: string): Promise<ReactionTarget[]> {
  const { data: children } = await supabase
    .from('children')
    .select('id, name')
    .eq('parent_id', parentId);

  if (!children?.length) return [];

  const childIds = children.map(c => c.id);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 1);

  const [missionsRes, reactedRes] = await Promise.all([
    supabase
      .from('mission_completions')
      .select('child_id, mission_title, completed_at')
      .in('child_id', childIds)
      .gte('completed_at', cutoff.toISOString())
      .order('completed_at', { ascending: false })
      .limit(10),
    supabase
      .from('mission_reactions')
      .select('child_id, mission_title')
      .eq('parent_id', parentId)
      .in('child_id', childIds)
      .gte('created_at', cutoff.toISOString()),
  ]);

  const reacted = new Set(
    (reactedRes.data ?? []).map(r => `${r.child_id}::${r.mission_title}`),
  );

  return (missionsRes.data ?? []).map(m => {
    const child = children.find(c => c.id === m.child_id);
    return {
      childId: m.child_id,
      childName: child?.name ?? '',
      missionTitle: m.mission_title,
      completedAt: m.completed_at,
      alreadyReacted: reacted.has(`${m.child_id}::${m.mission_title}`),
    };
  });
}
