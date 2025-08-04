'use client';

import { useState, useEffect } from 'react';
import GameCard from '@/components/GameCard';

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

interface Pick {
  gameId: string;
  pickedTeam: 'home' | 'away';
}

export default function PicksPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [picks, setPicks] = useState<Map<string, 'home' | 'away'>>(new Map());
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showUsernameModal, setShowUsernameModal] = useState(false);

  useEffect(() => {
    // Load picks from localStorage
    const savedPicks = localStorage.getItem('nflPicks');
    const savedUsername = localStorage.getItem('nflUsername');
    
    if (savedPicks) {
      const picksData = JSON.parse(savedPicks);
      setPicks(new Map(Object.entries(picksData)));
    }
    
    if (savedUsername) {
      setUsername(savedUsername);
    }
    
    fetchGames();
  }, []);

  useEffect(() => {
    // Save picks to localStorage whenever they change
    if (picks.size > 0) {
      const picksObject = Object.fromEntries(picks);
      localStorage.setItem('nflPicks', JSON.stringify(picksObject));
    }
  }, [picks]);

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games?season=2025&weekType=preseason&week=1');
      if (!response.ok) throw new Error('Failed to fetch games');
      const data = await response.json();
      setGames(data);
    } catch (err) {
      setError('Failed to load games');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePickChange = (gameId: string, team: 'home' | 'away') => {
    const newPicks = new Map(picks);
    newPicks.set(gameId, team);
    setPicks(newPicks);
    setError(null);
    setSuccess(null);
  };

  const handleSubmitPicks = async () => {
    // Check if username is set
    if (!username.trim()) {
      setShowUsernameModal(true);
      return;
    }

    // Check if all games have picks
    const unpickedGames = games.filter(game => {
      const gameDate = new Date(game.gameTime);
      const hasStarted = gameDate <= new Date();
      return !hasStarted && !picks.has(game.id);
    });

    if (unpickedGames.length > 0) {
      setError(`Please make picks for all games (${unpickedGames.length} remaining)`);
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const picksArray: Pick[] = Array.from(picks.entries()).map(([gameId, pickedTeam]) => ({
        gameId,
        pickedTeam,
      }));

      const response = await fetch('/api/picks/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          picks: picksArray,
          username: username.trim()
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit picks');
      }

      setSuccess('Picks submitted successfully! Redirecting to your dashboard...');
      
      // Save submission to localStorage
      localStorage.setItem('nflPicksSubmitted', 'true');
      localStorage.setItem('nflUsername', username);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit picks');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUsernameSubmit = () => {
    if (username.trim()) {
      localStorage.setItem('nflUsername', username);
      setShowUsernameModal(false);
      handleSubmitPicks();
    }
  };

  const getPickedCount = () => {
    const futureGames = games.filter(game => {
      const gameDate = new Date(game.gameTime);
      return gameDate > new Date();
    });
    const pickedFutureGames = futureGames.filter(game => picks.has(game.id));
    return {
      picked: pickedFutureGames.length,
      total: futureGames.length,
    };
  };

  const calculateScore = () => {
    let totalPoints = 0;
    let gamesCompleted = 0;

    games.forEach(game => {
      if (game.isComplete && picks.has(game.id)) {
        gamesCompleted++;
        const pick = picks.get(game.id);
        if (game.homeScore !== null && game.awayScore !== null && pick) {
          const actualDiff = game.homeScore - game.awayScore;
          const spreadResult = actualDiff + game.modifiedSpread;

          if (spreadResult === 0) {
            totalPoints += 0.5;
          } else if (
            (pick === 'home' && spreadResult > 0) ||
            (pick === 'away' && spreadResult < 0)
          ) {
            totalPoints += 1;
          }
        }
      }
    });

    return { totalPoints, gamesCompleted };
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading games...</div>
      </div>
    );
  }

  const { picked, total } = getPickedCount();
  const { totalPoints, gamesCompleted } = calculateScore();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">NFL Preseason Week 1 Picks</h1>
        
        {/* Username Display */}
        {username && (
          <div className="mb-4 text-sm text-gray-600">
            Playing as: <span className="font-semibold">{username}</span>
            <button
              onClick={() => setShowUsernameModal(true)}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              (change)
            </button>
          </div>
        )}
        
        {/* Status Bar */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <div className="text-sm text-gray-600">Progress</div>
              <div className="text-xl font-semibold">
                {picked} of {total} games picked
              </div>
            </div>
            {gamesCompleted > 0 && (
              <div>
                <div className="text-sm text-gray-600">Current Score</div>
                <div className="text-xl font-semibold">
                  {totalPoints} points ({gamesCompleted} games completed)
                </div>
              </div>
            )}
            <button
              onClick={handleSubmitPicks}
              disabled={submitting || picked === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Picks'}
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6">
            {success}
          </div>
        )}

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map(game => (
            <GameCard
              key={game.id}
              game={game}
              pick={picks.get(game.id) || null}
              onPickChange={handlePickChange}
              disabled={submitting}
            />
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold mb-2">How it works:</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Home teams receive a +6 point advantage to their spread</li>
            <li>• Pick the team you think will cover the modified spread</li>
            <li>• Win = 1 point, Loss = 0 points, Push (tie) = 0.5 points</li>
            <li>• You must pick all games before they start</li>
            <li>• Picks lock at game time</li>
            <li>• Your picks are saved locally in your browser</li>
          </ul>
        </div>
      </div>

      {/* Username Modal */}
      {showUsernameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Enter Your Username</h3>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleUsernameSubmit()}
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowUsernameModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleUsernameSubmit}
                disabled={!username.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                Save & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}