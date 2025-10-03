export interface SlackUser {
  id: string;
  name: string;
  real_name?: string;
  display_name?: string;
  email?: string;
  is_admin?: boolean;
  is_bot?: boolean;
  is_deleted?: boolean;
  updated?: number;
  deleted?: number;
  profile?: {
    real_name?: string;
    display_name?: string;
    email?: string;
    image_72?: string;
    title?: string;
    phone?: string;
  };
  tz?: string;
  tz_label?: string;
}

export interface SlackApiResponse {
  ok: boolean;
  members: SlackUser[];
  error?: string;
}

export type SortKey = 'name' | 'real_name' | 'email' | 'is_admin' | 'is_bot' | 'updated' | 'deleted';
export type SortDirection = 'asc' | 'desc';
