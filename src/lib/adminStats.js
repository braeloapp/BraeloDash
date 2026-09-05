export function emptyAdminStats() {
  return {
    users: { total: 0, active: 0, new_7d: 0, new_today: 0 },
    businesses: { total: 0, active: 0 },
    listings: { total: 0, active: 0, inactive: 0, by_category: {} },
    reports: { total: 0 },
    support_requests: { total: 0, open: 0 },
    messages: { total: 0, conversations: 0 },
    engagement: { listing_clicks: 0 },
    growth: { labels: [], users: [], businesses: [], listings: [] },
    recent_active_users: [],
  };
}

export function normalizeAdminStats(payload) {
  const data = payload?.data ?? payload ?? {};
  const empty = emptyAdminStats();
  return {
    users: { ...empty.users, ...(data.users || {}) },
    businesses: { ...empty.businesses, ...(data.businesses || {}) },
    listings: { ...empty.listings, ...(data.listings || {}) },
    reports: { ...empty.reports, ...(data.reports || {}) },
    support_requests: {
      ...empty.support_requests,
      ...(data.support_requests || {}),
    },
    messages: { ...empty.messages, ...(data.messages || {}) },
    engagement: { ...empty.engagement, ...(data.engagement || {}) },
    growth: { ...empty.growth, ...(data.growth || {}) },
    recent_active_users: Array.isArray(data.recent_active_users)
      ? data.recent_active_users
      : [],
  };
}

export function categoryEntries(byCategory = {}) {
  return Object.entries(byCategory).map(([key, value]) => ({
    name: key,
    listings: Number(value) || 0,
  }));
}
