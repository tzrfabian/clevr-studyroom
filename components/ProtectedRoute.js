'use client'
import { useAppContext } from '../lib/AppContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loader from './Loader';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div><Loader/></div>;
  }

  if (!user) {
    return null;
  }

  return children;
};

export default ProtectedRoute;