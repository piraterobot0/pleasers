'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface LeaderboardEntry {
  id: string;
  userId: string;
  totalPicks: number;
  correctPicks: number;
  ties: number;
  totalPoints: number;
  winPercentage: number;
  rank: number | null;
  user: {
    id: string;
    username: string;
    name: string | null;
    image: string | null;
  };
}

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard?season=2025&weekType=preseason&week=1');
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      const data = await response.json();
      setLeaderboard(data);
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading leaderboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
        <p className="text-gray-600 mb-8">NFL Preseason Week 1 - 2025</p>

        {leaderboard.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No picks have been scored yet.</p>
            <p className="text-sm text-gray-400 mt-2">Check back after games are completed!</p>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Record
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Win %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.map((entry, index) => {
                  const isCurrentUser = session?.user?.id === entry.userId;
                  return (
                    <tr
                      key={entry.id}
                      className={`${
                        isCurrentUser ? 'bg-blue-50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`text-lg font-bold ${
                            entry.rank === 1 ? 'text-yellow-500' :
                            entry.rank === 2 ? 'text-gray-400' :
                            entry.rank === 3 ? 'text-orange-600' :
                            'text-gray-600'
                          }`}>
                            {entry.rank || '-'}
                          </span>
                          {entry.rank === 1 && '🏆'}
                          {entry.rank === 2 && '🥈'}
                          {entry.rank === 3 && '🥉'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {entry.user.image && (
                            <img
                              className="h-8 w-8 rounded-full mr-3"
                              src={entry.user.image}
                              alt=""
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {entry.user.name || entry.user.username}
                            </div>
                            <div className="text-xs text-gray-500">
                              @{entry.user.username}
                            </div>
                          </div>
                          {isCurrentUser && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-xl font-bold text-gray-900">
                          {entry.totalPoints}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                        {entry.correctPicks}-{entry.totalPicks - entry.correctPicks - entry.ties}
                        {entry.ties > 0 && `-${entry.ties}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          entry.winPercentage >= 60 ? 'bg-green-100 text-green-800' :
                          entry.winPercentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {entry.winPercentage.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 text-sm text-gray-500 text-center">
          <p>Leaderboard updates automatically as games complete</p>
          <p>Win = 1 point | Push = 0.5 points | Loss = 0 points</p>
        </div>
      </div>
    </div>
  );
}