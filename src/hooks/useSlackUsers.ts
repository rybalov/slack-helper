import { useState, useEffect } from 'react';
import { SlackUser, SlackApiResponse } from '../types/User';

export const useSlackUsers = (token?: string) => {
  const [users, setUsers] = useState<SlackUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    if (!token) {
      setError('API token is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/slack/users.list', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SlackApiResponse = await response.json();

      if (!data.ok) {
        throw new Error(data.error || 'API request failed');
      }

      // Filter out deleted users and bots if needed
      const activeUsers = data.members.filter(user => !user.is_deleted);
      setUsers(activeUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching Slack users:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    refetch: fetchUsers
  };
};
