'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Home, Heart, LogOut, User, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export function Header() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Don't show header on login/register pages
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className=" flex h-16 justify-between" style={{width: "100%", paddingLeft: "2rem", paddingRight: "2rem" }}>
        {/* Logo / Brand */}
        <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
                <MapPin className="h-6 w-6" />
                <span className="font-bold text-xl">Activity Hub</span>
            </Link>

            {/* Navigation */}
            {user && (
                <nav className="hidden md:flex items-center gap-6">
                <Link
                    href="/"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === '/' ? 'text-foreground' : 'text-foreground/60'
                    }`}
                >
                    <Home className="inline-block w-4 h-4 mr-1" />
                    Home
                </Link>
                <Link
                    href="/favorites"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === '/favorites' ? 'text-foreground' : 'text-foreground/60'
                    }`}
                >
                    <Heart className="inline-block w-4 h-4 mr-1" />
                    Favorites
                </Link>
                </nav>
            )}
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-4">
            {loading ? (
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              <>
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                    {user.displayName || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                    </p>
                </div>
                <Button onClick={handleLogout}>Logout</Button>
              </>
            ) : (
                <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                    <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                    <Link href="/register">Sign Up</Link>
                </Button>
                </div>
            )}
        </div>
      </div>
    </header>
  );
}