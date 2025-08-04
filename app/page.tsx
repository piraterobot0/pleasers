'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            NFL Spreads Picker
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Pick NFL games with a twist - home teams get a +6 point advantage!
          </p>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="space-y-2">
                <div className="text-3xl">🏈</div>
                <h3 className="font-semibold">Modified Spreads</h3>
                <p className="text-sm text-gray-600">
                  Every home team gets +6 points added to their spread, making picks more interesting
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl">🎯</div>
                <h3 className="font-semibold">Make Your Picks</h3>
                <p className="text-sm text-gray-600">
                  Pick the team you think will cover the modified spread for each game
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl">🏆</div>
                <h3 className="font-semibold">Compete & Win</h3>
                <p className="text-sm text-gray-600">
                  Earn 1 point for wins, 0.5 for pushes. Top the leaderboard!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-lg mb-2">🔥 Preseason Week 1 - 2025</h3>
            <p className="text-gray-700 mb-4">
              16 games available for picking! Get your picks in before games start.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/picks"
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                Make Your Picks
              </Link>
              <Link
                href="/leaderboard"
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
              >
                View Leaderboard
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-3">Scoring System</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex justify-between">
                  <span>Correct Pick:</span>
                  <span className="font-semibold">1.0 point</span>
                </li>
                <li className="flex justify-between">
                  <span>Push (Tie):</span>
                  <span className="font-semibold">0.5 points</span>
                </li>
                <li className="flex justify-between">
                  <span>Incorrect Pick:</span>
                  <span className="font-semibold">0 points</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-3">Quick Stats</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex justify-between">
                  <span>Total Games:</span>
                  <span className="font-semibold">16</span>
                </li>
                <li className="flex justify-between">
                  <span>Max Points:</span>
                  <span className="font-semibold">16.0</span>
                </li>
                <li className="flex justify-between">
                  <span>Home Advantage:</span>
                  <span className="font-semibold">+6 points</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold mb-2">No Sign-up Required!</h3>
            <p className="text-sm text-gray-600">
              Just enter a username when you submit your picks. Your picks are saved locally in your browser.
            </p>
          </div>

          <div className="mt-12 text-sm text-gray-500">
            <p>Pick deadline: Before each game starts</p>
            <p>All times shown in your local timezone</p>
          </div>
        </div>
      </div>
    </div>
  );
}