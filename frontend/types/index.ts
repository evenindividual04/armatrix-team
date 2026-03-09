export interface TeamMember {
  id: number;
  name: string;
  role: string;
  department: string;
  bio: string;
  photo_url: string;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  email?: string | null;
  card_size: 'featured' | 'wide' | 'standard';
  order: number;
  created_at: string;
  updated_at: string;
}

export interface DepartmentStats {
  department: string;
  count: number;
}

export interface StatsResponse {
  total: number;
  by_department: DepartmentStats[];
}
