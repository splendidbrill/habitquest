import { supabase } from '../lib/supabase';

export type PhotoSubmission = {
  id: string;
  parentId: string;
  photoUrl: string;
  submittedAt: string;
};

export type VoucherWin = {
  id: string;
  parentId: string;
  rewardName: string;
  rewardValue: string;
  wonAt: string;
  claimed: boolean;
};

export type PhotoStats = {
  totalSubmissions: number;
  totalTickets: number;
  totalWins: number;
  ticketsThisWeek: number;
};

const REWARDS = [
  { name: '£5 Tesco voucher',         value: '£5',  weight: 10 },
  { name: 'Free swimming pass',        value: 'Free swim', weight: 5 },
  { name: '£10 Sports Direct voucher', value: '£10', weight: 3 },
];

// ─── Upload photo to Supabase Storage and record submission ──────────────────
export async function uploadMealPhoto(
  parentId: string,
  photoUri: string,
  fileName: string,
  mimeType: string,
): Promise<{ submission: PhotoSubmission; win: VoucherWin | null }> {
  // Read file as blob via fetch
  const res = await fetch(photoUri);
  const blob = await res.blob();

  const path = `${parentId}/${Date.now()}_${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('meal-photos')
    .upload(path, blob, { contentType: mimeType, upsert: false });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from('meal-photos')
    .getPublicUrl(path);

  const photoUrl = urlData.publicUrl;

  // Record submission
  const { data: sub, error: subError } = await supabase
    .from('photo_submissions')
    .insert({ parent_id: parentId, photo_url: photoUrl })
    .select('*')
    .single();

  if (subError) throw subError;

  const submission: PhotoSubmission = {
    id: sub.id,
    parentId: sub.parent_id,
    photoUrl: sub.photo_url,
    submittedAt: sub.submitted_at,
  };

  // Run lottery draw
  const win = await runLotteryDraw(parentId);

  return { submission, win };
}

// ─── Lottery draw — runs after every upload ───────────────────────────────────
async function runLotteryDraw(parentId: string): Promise<VoucherWin | null> {
  const roll = Math.random() * 100;
  let cumulative = 0;

  for (const reward of REWARDS) {
    cumulative += reward.weight;
    if (roll < cumulative) {
      const { data } = await supabase
        .from('voucher_wins')
        .insert({ parent_id: parentId, reward_name: reward.name, reward_value: reward.value, claimed: false })
        .select('*')
        .single();

      if (!data) return null;
      return {
        id: data.id,
        parentId: data.parent_id,
        rewardName: data.reward_name,
        rewardValue: data.reward_value,
        wonAt: data.won_at,
        claimed: data.claimed,
      };
    }
  }

  return null;
}

// ─── Load parent stats ────────────────────────────────────────────────────────
export async function loadPhotoStats(parentId: string): Promise<PhotoStats> {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [subRes, winRes, weekRes] = await Promise.all([
    supabase
      .from('photo_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('parent_id', parentId),
    supabase
      .from('voucher_wins')
      .select('id', { count: 'exact', head: true })
      .eq('parent_id', parentId),
    supabase
      .from('photo_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('parent_id', parentId)
      .gte('submitted_at', weekAgo.toISOString()),
  ]);

  return {
    totalSubmissions: subRes.count ?? 0,
    totalTickets:     subRes.count ?? 0,
    totalWins:        winRes.count ?? 0,
    ticketsThisWeek:  weekRes.count ?? 0,
  };
}

// ─── Load photo gallery ───────────────────────────────────────────────────────
export async function loadPhotoGallery(parentId: string): Promise<PhotoSubmission[]> {
  const { data } = await supabase
    .from('photo_submissions')
    .select('*')
    .eq('parent_id', parentId)
    .order('submitted_at', { ascending: false })
    .limit(20);

  return (data ?? []).map(r => ({
    id: r.id,
    parentId: r.parent_id,
    photoUrl: r.photo_url,
    submittedAt: r.submitted_at,
  }));
}

// ─── Load voucher wins ────────────────────────────────────────────────────────
export async function loadVoucherWins(parentId: string): Promise<VoucherWin[]> {
  const { data } = await supabase
    .from('voucher_wins')
    .select('*')
    .eq('parent_id', parentId)
    .order('won_at', { ascending: false });

  return (data ?? []).map(r => ({
    id: r.id,
    parentId: r.parent_id,
    rewardName: r.reward_name,
    rewardValue: r.reward_value,
    wonAt: r.won_at,
    claimed: r.claimed,
  }));
}

// ─── Claim a voucher ──────────────────────────────────────────────────────────
export async function claimVoucher(voucherId: string): Promise<void> {
  await supabase
    .from('voucher_wins')
    .update({ claimed: true })
    .eq('id', voucherId);
}
