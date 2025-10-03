import React, { useState, useMemo } from 'react';
import { SlackUser, SortKey, SortDirection } from '../types/User';

interface UserTableProps {
  users: SlackUser[];
  loading: boolean;
}

const UserTable: React.FC<UserTableProps> = ({ users, loading }) => {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showOnlyDeleted, setShowOnlyDeleted] = useState(false);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedUsers = useMemo(() => {
    const filtered = showOnlyDeleted
      ? users.filter(user => user.deleted || user.is_deleted)
      : users;

    return [...filtered].sort((a, b) => {
      let aValue: string | boolean | number = '';
      let bValue: string | boolean | number = '';

      switch (sortKey) {
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'real_name':
          aValue = a.profile?.real_name || a.real_name || '';
          bValue = b.profile?.real_name || b.real_name || '';
          break;
        case 'email':
          aValue = a.profile?.email || '';
          bValue = b.profile?.email || '';
          break;
        case 'is_admin':
          aValue = a.is_admin || false;
          bValue = b.is_admin || false;
          break;
        case 'is_bot':
          aValue = a.is_bot || false;
          bValue = b.is_bot || false;
          break;
        case 'updated':
          aValue = a.updated || 0;
          bValue = b.updated || 0;
          break;
        case 'deleted':
          aValue = a.deleted || 0;
          bValue = b.deleted || 0;
          break;
      }

      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        return sortDirection === 'asc'
          ? (aValue === bValue ? 0 : aValue ? 1 : -1)
          : (aValue === bValue ? 0 : aValue ? -1 : 1);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const comparison = aValue.toString().localeCompare(bValue.toString());
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [users, sortKey, sortDirection, showOnlyDeleted]);

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4 shadow-md">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyDeleted}
              onChange={(e) => setShowOnlyDeleted(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              Show only deleted users
            </span>
          </label>
          {showOnlyDeleted && (
            <span className="text-sm text-gray-500">
              ({filteredAndSortedUsers.length} из {users.length})
            </span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg">
      <table className="w-full bg-white table-fixed">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-16 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Avatar
            </th>
            <th
              className="w-36 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('real_name')}
            >
              Name {getSortIcon('real_name')}
            </th>
            <th
              className="w-48 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('email')}
            >
              Email {getSortIcon('email')}
            </th>
            <th className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th
              className="w-20 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('is_admin')}
            >
              Admin {getSortIcon('is_admin')}
            </th>
            <th
              className="w-20 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('is_bot')}
            >
              Bot {getSortIcon('is_bot')}
            </th>
            <th
              className="w-28 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('updated')}
            >
              Updated {getSortIcon('updated')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredAndSortedUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-3 py-4 whitespace-nowrap">
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={user.profile?.image_72 || `https://picsum.photos/72/72?random=${user.id}`}
                  alt={user.name}
                />
              </td>
              <td className="px-3 py-4 text-sm text-gray-900 truncate">
                {user.profile?.real_name || user.real_name || '-'}
              </td>
              <td className="px-3 py-4 text-sm text-gray-900 truncate">
                {user.profile?.email || '-'}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 truncate">
                {user.profile?.title || '-'}
              </td>
              <td className="px-2 py-4 whitespace-nowrap">
                <span className={`inline-flex px-1 py-0.5 text-xs font-semibold rounded ${
                  user.is_admin ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.is_admin ? 'Yes' : 'No'}
                </span>
              </td>
              <td className="px-2 py-4 whitespace-nowrap">
                <span className={`inline-flex px-1 py-0.5 text-xs font-semibold rounded ${
                  user.is_bot ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.is_bot ? 'Yes' : 'No'}
                </span>
              </td>
              <td className="px-2 py-4 text-xs text-gray-500">
                {user.updated ? new Date(user.updated * 1000).toLocaleDateString() : 'Never'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredAndSortedUsers.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {showOnlyDeleted ? 'Удаленные пользователи не найдены' : 'No users found'}
        </div>
      )}
      </div>
    </div>
  );
};

export default UserTable;
