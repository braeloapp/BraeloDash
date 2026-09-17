export function emptyAdminStats() {
  return {
    users: { total: 0, active: 0, new_7d: 0, new_today: 0 },
    businesses: { total: 0, active: 0 },
    listings: { total: 0, active: 0, inactive: 0, by_category: {} },
    reports: { total: 0, pending: 0 },
    support_requests: { total: 0, open: 0, in_progress: 0 },
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

/**
 * Map analytics/overview payload into the dashboard stats shape.
 * Overview is the source of truth when /statistics returns empty zeros.
 */
export function statsFromOverview(overview, recentUsers = []) {
  const empty = emptyAdminStats();
  if (!overview?.kpis) return empty;

  const k = overview.kpis;
  const series = overview.series || {};
  const labels = mergeSeriesDates(series);

  return {
    ...empty,
    users: {
      total: Number(k.users?.total) || 0,
      active: Number(k.users?.active) || 0,
      new_7d: Number(k.users?.new_7d) || 0,
      new_today: Number(k.users?.new_today) || 0,
    },
    businesses: {
      total: Number(k.businesses?.total) || 0,
      active: Number(k.businesses?.active) || 0,
    },
    listings: {
      total: Number(k.listings?.total) || 0,
      active: Number(k.listings?.active) || 0,
      inactive: Number(k.listings?.inactive) || 0,
      by_category: overview.listings_by_category || {},
    },
    reports: {
      total:
        (Number(k.moderation?.pending_reports) || 0) +
        (Number(k.moderation?.resolved_reports) || 0) +
        (Number(k.moderation?.ignored_reports) || 0),
      pending: Number(k.moderation?.pending_reports) || 0,
    },
    support_requests: {
      total:
        (Number(k.support?.open) || 0) +
        (Number(k.support?.in_progress) || 0) +
        (Number(k.support?.resolved) || 0),
      open: Number(k.support?.open) || 0,
      in_progress: Number(k.support?.in_progress) || 0,
    },
    growth: {
      labels,
      users: seriesValues(series.users, labels),
      businesses: seriesValues(series.businesses, labels),
      listings: seriesValues(series.listings, labels),
    },
    recent_active_users: Array.isArray(recentUsers) ? recentUsers : [],
  };
}

export function mergeSeriesDates(series = {}) {
  const set = new Set();
  for (const key of ["users", "listings", "businesses", "support", "reports"]) {
    for (const row of series[key] || []) {
      if (row?.date) set.add(row.date);
    }
  }
  return Array.from(set).sort();
}

export function seriesValues(rows = [], labels = []) {
  const map = {};
  for (const row of rows || []) {
    if (row?.date) map[row.date] = Number(row.value) || 0;
  }
  return labels.map((label) => map[label] || 0);
}

export function categoryEntries(byCategory = {}) {
  return Object.entries(byCategory).map(([key, value]) => ({
    name: key,
    listings: Number(value) || 0,
  }));
}

export function isEmptyStats(stats) {
  if (!stats) return true;
  return (
    !(stats.users?.total || 0) &&
    !(stats.listings?.total || 0) &&
    !(stats.businesses?.total || 0) &&
    !(stats.support_requests?.total || 0)
  );
}
