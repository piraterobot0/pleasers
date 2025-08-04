'use client';

import { useState, useEffect } from 'react';

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
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);

  useEffect(() => {
    const savedUsername = localStorage.getItem('nflUsername');
    setCurrentUsername(savedUsername);
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
            <p className="text-gray-500">No picks have been submitted yet.</p>
            <p className="text-sm text-gray-400 mt-2">Be the first to make your picks!</p>
            <a href="/picks" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Make Your Picks
            </a>
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
                    Picks Made
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
                  const isCurrentUser = currentUsername === entry.user.username;
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
                            entry.totalPoints > 0 && entry.rank === 1 ? 'text-yellow-500' :
                            entry.totalPoints > 0 && entry.rank === 2 ? 'text-gray-400' :
                            entry.totalPoints > 0 && entry.rank === 3 ? 'text-orange-600' :
                            'text-gray-600'
                          }`}>
                            {entry.totalPoints > 0 ? (entry.rank || index + 1) : index + 1}
                          </span>
                          {entry.totalPoints > 0 && entry.rank === 1 && '🏆'}
                          {entry.totalPoints > 0 && entry.rank === 2 && '🥈'}
                          {entry.totalPoints > 0 && entry.rank === 3 && '🥉'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
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
                        <span className="font-medium">{entry.totalPicks}/16</span>
                        <div className="text-xs text-gray-400 mt-1">
                          {entry.totalPicks === 16 ? 'Complete' : `${16 - entry.totalPicks} remaining`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                        {entry.correctPicks + entry.ties > 0 ? (
                          <>{entry.correctPicks}-{entry.totalPicks - entry.correctPicks - entry.ties}
                          {entry.ties > 0 && `-${entry.ties}`}</>
                        ) : (
                          <span className="text-gray-400">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {entry.correctPicks + entry.ties > 0 ? (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            entry.winPercentage >= 60 ? 'bg-green-100 text-green-800' :
                            entry.winPercentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {entry.winPercentage.toFixed(1)}%
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 text-sm text-gray-500 text-center">
          <p>Showing all users who have submitted picks for this week</p>
          <p>Leaderboard updates automatically as games complete</p>
          <p>Win = 1 point | Push = 0.5 points | Loss = 0 points</p>
        </div>
      </div>
    </div>
  );
}