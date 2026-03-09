import type { TeamMember, StatsResponse } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  getTeam: (params?: { department?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.department) query.set('department', params.department);
    if (params?.search) query.set('search', params.search);
    const qs = query.toString();
    return apiFetch<TeamMember[]>(`/api/team${qs ? `?${qs}` : ''}`);
  },
  getMember: (id: number) => apiFetch<TeamMember>(`/api/team/${id}`),
  getStats: () => apiFetch<StatsResponse>('/api/team/stats'),
  createMember: (data: Partial<TeamMember>) =>
    apiFetch<TeamMember>('/api/team', { method: 'POST', body: JSON.stringify(data) }),
  updateMember: (id: number, data: Partial<TeamMember>) =>
    apiFetch<TeamMember>(`/api/team/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMember: (id: number) =>
    apiFetch<TeamMember>(`/api/team/${id}`, { method: 'DELETE' }),
};
