'use client';

import { useState, useEffect } from 'react';

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

interface GameCardProps {
  game: Game;
  pick?: 'home' | 'away' | null;
  onPickChange: (gameId: string, team: 'home' | 'away') => void;
  disabled?: boolean;
}

export default function GameCard({ game, pick, onPickChange, disabled = false }: GameCardProps) {
  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away' | null>(pick || null);
  const gameDate = new Date(game.gameTime);
  const hasStarted = gameDate <= new Date();
  const isDisabled = disabled || hasStarted || game.isComplete;

  useEffect(() => {
    setSelectedTeam(pick || null);
  }, [pick]);

  const handlePickChange = (team: 'home' | 'away') => {
    if (!isDisabled) {
      setSelectedTeam(team);
      onPickChange(game.id, team);
    }
  };

  const formatSpread = (spread: number, teamName: string) => {
    if (spread === 0) return `${teamName} PICK`;
    return spread > 0 ? `${teamName} +${spread}` : `${teamName} ${spread}`;
  };

  const getPickResult = () => {
    if (!game.isComplete || !selectedTeam || game.homeScore === null || game.awayScore === null) {
      return null;
    }

    const actualDiff = game.homeScore! - game.awayScore!;
    const spreadResult = actualDiff + game.modifiedSpread;

    if (spreadResult === 0) {
      return { result: 'push', points: 0.5 };
    }

    if (selectedTeam === 'home') {
      return spreadResult > 0 
        ? { result: 'win', points: 1 }
        : { result: 'loss', points: 0 };
    } else {
      return spreadResult < 0
        ? { result: 'win', points: 1 }
        : { result: 'loss', points: 0 };
    }
  };

  const pickResult = getPickResult();

  return (
    <div className={`border rounded-lg p-4 ${game.isComplete ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="text-sm text-gray-500">
          {gameDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          {' '}
          {gameDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        </div>
        {game.isComplete && (
          <span className="text-xs font-semibold text-gray-600">FINAL</span>
        )}
      </div>

      <div className="space-y-3">
        {/* Away Team */}
        <button
          onClick={() => handlePickChange('away')}
          disabled={isDisabled}
          className={`w-full text-left p-3 rounded-md border-2 transition-all ${
            selectedTeam === 'away'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          } ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold">{game.awayTeam}</div>
              <div className="text-sm text-gray-600">
                {formatSpread(-game.modifiedSpread, game.awayTeam)}
              </div>
            </div>
            {game.isComplete && (
              <div className="text-xl font-bold">{game.awayScore}</div>
            )}
          </div>
        </button>

        {/* Home Team */}
        <button
          onClick={() => handlePickChange('home')}
          disabled={isDisabled}
          className={`w-full text-left p-3 rounded-md border-2 transition-all ${
            selectedTeam === 'home'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          } ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold">{game.homeTeam}</div>
              <div className="text-sm text-gray-600">
                {formatSpread(game.modifiedSpread, game.homeTeam)}
              </div>
            </div>
            {game.isComplete && (
              <div className="text-xl font-bold">{game.homeScore}</div>
            )}
          </div>
        </button>
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
          {pickResult.result === 'win' && `WIN (+${pickResult.points})`}
          {pickResult.result === 'push' && `PUSH (+${pickResult.points})`}
          {pickResult.result === 'loss' && `LOSS (${pickResult.points})`}
        </div>
      )}

      {/* Spread Info */}
      <div className="mt-3 text-xs text-gray-500 text-center">
        Original: {formatSpread(game.originalSpread, game.homeTeam)} | 
        Modified: {formatSpread(game.modifiedSpread, game.homeTeam)}
      </div>

      {hasStarted && !game.isComplete && (
        <div className="mt-2 text-xs text-orange-600 text-center">
          Game has started - picks locked
        </div>
      )}
    </div>
  );
}