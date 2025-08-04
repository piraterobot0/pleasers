'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-blue-600">
              NFL Picks
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <Link
                href="/picks"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/picks')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Make Picks
              </Link>
              <Link
                href="/leaderboard"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/leaderboard')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Leaderboard
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <span className="text-gray-700">{session.user?.name || session.user?.email}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden pb-3">
          <div className="flex space-x-2">
            <Link
              href="/picks"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/picks')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Make Picks
            </Link>
            <Link
              href="/leaderboard"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/leaderboard')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}