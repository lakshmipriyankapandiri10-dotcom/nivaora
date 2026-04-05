import { supabase } from './supabase';

export const earnBadge = async (badgeId, badgeName, badgeIcon) => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    await supabase.from('user_badges').insert([{
      user_id: userData.user.id,
      badge_id: badgeId,
      badge_name: badgeName,
      badge_icon: badgeIcon,
    }]);
  } catch (err) {
    // Already earned — ignore duplicate error
    console.log('Badge already earned or error:', err);
  }
};