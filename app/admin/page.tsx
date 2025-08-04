'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  originalSpread: number;
  modifiedSpread: number;
  gameTime: string;
  homeScore?: number | null;
  awayScore?: number | null;
  isComplete: boolean;
}

export default function AdminPage() {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scores, setScores] = useState<Record<string, { home: string; away: string }>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Check if admin key is saved in localStorage
    const savedKey = localStorage.getItem('adminKey');
    if (savedKey) {
      setAdminKey(savedKey);
      setIsAuthenticated(true);
      fetchGames();
    }
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games?season=2025&weekType=preseason&week=1');
      if (!response.ok) throw new Error('Failed to fetch games');
      const data = await response.json();
      setGames(data);
      
      // Initialize scores
      const initialScores: Record<string, { home: string; away: string }> = {};
      data.forEach((game: Game) => {
        initialScores[game.id] = {
          home: game.homeScore?.toString() || '',
          away: game.awayScore?.toString() || '',
        };
      });
      setScores(initialScores);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load games' });
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey.trim()) {
      localStorage.setItem('adminKey', adminKey);
      setIsAuthenticated(true);
      fetchGames();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminKey');
    setIsAuthenticated(false);
    setAdminKey('');
  };

  const handleScoreChange = (gameId: string, team: 'home' | 'away', value: string) => {
    setScores(prev => ({
      ...prev,
      [gameId]: {
        ...prev[gameId],
        [team]: value,
      },
    }));
  };

  const handleUpdateScore = async (gameId: string) => {
    const gameScores = scores[gameId];
    const homeScore = parseInt(gameScores.home);
    const awayScore = parseInt(gameScores.away);

    if (isNaN(homeScore) || isNaN(awayScore)) {
      setMessage({ type: 'error', text: 'Please enter valid scores' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/games/update?key=${adminKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId,
          homeScore,
          awayScore,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update score');
      }

      setMessage({ type: 'success', text: 'Score updated successfully!' });
      
      // Refresh games
      await fetchGames();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update score' });
    } finally {
      setLoading(false);
    }
  };

  const seedGames = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/games/seed', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to seed games');
      setMessage({ type: 'success', text: 'Games seeded successfully!' });
      await fetchGames();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to seed games' });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Admin Access</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter admin key to manage game scores
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter admin key"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Access Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <div className="space-x-2">
            <button
              onClick={seedGames}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              Seed Games
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Game
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Game Time
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Away Score
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Home Score
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {games.map((game) => {
                const gameDate = new Date(game.gameTime);
                return (
                  <tr key={game.id} className={game.isComplete ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {game.awayTeam}
                      </div>
                      <div className="text-sm text-gray-500">
                        @ {game.homeTeam}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      {gameDate.toLocaleDateString()}<br/>
                      {gameDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <input
                        type="number"
                        value={scores[game.id]?.away || ''}
                        onChange={(e) => handleScoreChange(game.id, 'away', e.target.value)}
                        disabled={game.isComplete}
                        className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center disabled:bg-gray-100"
                        placeholder="0"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <input
                        type="number"
                        value={scores[game.id]?.home || ''}
                        onChange={(e) => handleScoreChange(game.id, 'home', e.target.value)}
                        disabled={game.isComplete}
                        className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center disabled:bg-gray-100"
                        placeholder="0"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        game.isComplete 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {game.isComplete ? 'Complete' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleUpdateScore(game.id)}
                        disabled={loading || game.isComplete}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {game.isComplete ? 'Updated' : 'Update'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Instructions:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Click "Seed Games" to initialize the database with game data</li>
            <li>• Enter scores for completed games</li>
            <li>• Click "Update" to save scores and calculate pick results</li>
            <li>• Scores are automatically calculated and leaderboard updated</li>
            <li>• Games marked as complete cannot be edited again</li>
          </ul>
        </div>
      </div>
    </div>
  );
}