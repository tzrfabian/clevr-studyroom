'use client'
import { useAppContext } from '../lib/AppContext';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '../lib/firebase';

export default function AppLayout({ children }) {
  const { user, loading } = useAppContext();
  const pathname = usePathname();
  const router = useRouter();

  const showAuthLinks = pathname !== '/login' && pathname !== '/register';

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
      <header className="bg-primary text-primary-content shadow-lg">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Clevr
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {showAuthLinks && (
              user ? (
                <>
                  <Link href="/dashboard" className="btn btn-ghost">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="btn btn-ghost">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn btn-ghost">
                    Login
                  </Link>
                  <Link href="/register" className="btn btn-ghost">
                    Register
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-neutral text-neutral-content">
        <div className="container mx-auto px-4 py-2 text-center">
          © 2024 Clevr. All rights reserved.
        </div>
      </footer>
    </div>
  );
}