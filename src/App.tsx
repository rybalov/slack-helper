import React, { useState } from 'react';
import { useSlackUsers } from './hooks/useSlackUsers';
import UserTable from './components/UserTable';

function App() {
  const [token, setToken] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { users, loading, error, fetchUsers } = useSlackUsers(token);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      setHasSubmitted(true);
      fetchUsers();
    }
  };

  const handleReset = () => {
    setToken('');
    setHasSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Slack Helper</h1>
        </div>

        {!hasSubmitted ? (
          <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Connect to Slack</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                  Slack Bot Token
                </label>
                <input
                  type="password"
                  id="token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="xoxb-your-bot-token-here"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="mt-2 text-sm text-gray-500">
                  Enter your Slack bot token with users:read scope
                </p>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
              >
                Load Users
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold">Users ({users.length})</h2>
                <button
                  onClick={fetchUsers}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition duration-200"
                >
                  {loading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
              <button
                onClick={handleReset}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
              >
                Change Token
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error loading users</h3>
                    <div className="mt-2 text-sm text-red-700">
                      {error}
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={fetchUsers}
                        className="bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 transition duration-200"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <UserTable users={users} loading={loading} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
