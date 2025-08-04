'use client';

import { useState, useEffect } from 'react';
import GameCard from '@/components/GameCard';

interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  originalSpread: number;
  modifiedSpread: number;
  homeScore?: number | null;
  awayScore?: number | null;
  gameTime: string;
  isComplete: boolean;
}

interface Pick {
  id: string;
  gameId: string;
  pickedTeam: 'home' | 'away';
  isCorrect?: boolean | null;
  points?: number | null;
  game: Game;
}

interface UserData {
  user: {
    id: string;
    username: string;
    name?: string | null;
  };
  picks: Pick[];
  stats: {
    totalPoints: number;
    correctPicks: number;
    incorrectPicks: number;
    ties: number;
    pendingGames: number;
    totalPicks: number;
    completedGames: number;
  };
}

export default function DashboardPage() {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUsernameModal, setShowUsernameModal] = useState(true);

  useEffect(() => {
    // Check if username is saved in localStorage
    const savedUsername = localStorage.getItem('nflUsername');
    if (savedUsername) {
      setUsername(savedUsername);
      setShowUsernameModal(false);
      fetchUserData(savedUsername);
    }
  }, []);

  const fetchUserData = async (usernameToFetch: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/user/picks?username=${encodeURIComponent(usernameToFetch)}&season=2025&weekType=preseason&week=1`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Username not found. Have you submitted picks yet?');
        }
        throw new Error('Failed to fetch user data');
      }
      
      const data = await response.json();
      setUserData(data);
      localStorage.setItem('nflUsername', usernameToFetch);
    } catch (err: any) {
      setError(err.message || 'Failed to load your picks');
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setShowUsernameModal(false);
      fetchUserData(username.trim());
    }
  };

  const handleChangeUsername = () => {
    setShowUsernameModal(true);
    setUserData(null);
    setError(null);
  };

  const getPickResult = (pick: Pick) => {
    const game = pick.game;
    
    if (!game.isComplete || game.homeScore === null || game.awayScore === null) {
      return null;
    }

    const actualDiff = game.homeScore - game.awayScore;
    const spreadResult = actualDiff + game.modifiedSpread;

    if (spreadResult === 0) {
      return { result: 'push', points: 0.5, label: 'PUSH' };
    }

    if (pick.pickedTeam === 'home') {
      return spreadResult > 0 
        ? { result: 'win', points: 1, label: 'WIN' }
        : { result: 'loss', points: 0, label: 'LOSS' };
    } else {
      return spreadResult < 0
        ? { result: 'win', points: 1, label: 'WIN' }
        : { result: 'loss', points: 0, label: 'LOSS' };
    }
  };

  if (showUsernameModal && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">View Your Dashboard</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your username to see your picks and score
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleUsernameSubmit}>
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading your dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 text-center">
            <p className="text-lg font-semibold mb-2">{error}</p>
            <button
              onClick={handleChangeUsername}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try Different Username
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
          <div className="flex items-center space-x-4 text-gray-600">
            <span>Username: <strong>{userData.user.username}</strong></span>
            <button
              onClick={handleChangeUsername}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              (change)
            </button>
          </div>
        </div>

        {/* Score Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">{userData.stats.totalPoints}</div>
            <div className="text-sm text-gray-600">Total Points</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">{userData.stats.correctPicks}</div>
            <div className="text-sm text-gray-600">Correct Picks</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-yellow-600">{userData.stats.ties}</div>
            <div className="text-sm text-gray-600">Pushes</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-gray-600">
              {userData.stats.completedGames}/{userData.stats.totalPicks}
            </div>
            <div className="text-sm text-gray-600">Games Complete</div>
          </div>
        </div>

        {/* Win Percentage Bar */}
        {userData.stats.completedGames > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold">Win Rate</span>
              <span className="text-sm font-semibold">
                {((userData.stats.correctPicks / userData.stats.completedGames) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-green-500 h-4 rounded-full"
                style={{ width: `${(userData.stats.correctPicks / userData.stats.completedGames) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Picks Grid */}
        <h2 className="text-xl font-semibold mb-4">Your Picks - Preseason Week 1</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userData.picks.map((pick) => {
            const gameDate = new Date(pick.game.gameTime);
            const pickResult = getPickResult(pick);
            
            return (
              <div key={pick.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-sm text-gray-500">
                    {gameDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    {' '}
                    {gameDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </div>
                  {pick.game.isComplete && (
                    <span className="text-xs font-semibold text-gray-600">FINAL</span>
                  )}
                </div>

                {/* Teams */}
                <div className="space-y-2">
                  {/* Away Team */}
                  <div className={`p-3 rounded-md border-2 ${
                    pick.pickedTeam === 'away' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{pick.game.awayTeam}</div>
                        <div className="text-sm text-gray-600">
                          {pick.game.modifiedSpread > 0 ? `-${pick.game.modifiedSpread}` : 'PICK'}
                        </div>
                      </div>
                      {pick.game.isComplete && (
                        <div className="text-xl font-bold">{pick.game.awayScore}</div>
                      )}
                    </div>
                  </div>

                  {/* Home Team */}
                  <div className={`p-3 rounded-md border-2 ${
                    pick.pickedTeam === 'home' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{pick.game.homeTeam}</div>
                        <div className="text-sm text-gray-600">
                          {pick.game.modifiedSpread > 0 ? '+' : ''}{pick.game.modifiedSpread}
                        </div>
                      </div>
                      {pick.game.isComplete && (
                        <div className="text-xl font-bold">{pick.game.homeScore}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pick Result */}
                {pickResult && (
                  <div className={`mt-3 p-2 rounded text-center text-sm font-semibold ${
                    pickResult.result === 'win' 
                      ? 'bg-green-100 text-green-800'
                      : pickResult.result === 'push'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {pickResult.label} (+{pickResult.points})
                  </div>
                )}

                {/* Your Pick Indicator */}
                <div className="mt-2 text-center text-xs text-gray-500">
                  Your pick: {pick.pickedTeam === 'home' ? pick.game.homeTeam : pick.game.awayTeam}
                </div>
              </div>
            );
          })}
        </div>

        {userData.picks.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No picks found for this week.</p>
            <a href="/picks" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Make Your Picks
            </a>
          </div>
        )}
      </div>
    </div>
  );
}