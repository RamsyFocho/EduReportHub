"use client";

import { useEffect, useState } from 'react';
import Loader from '@/components/loader/loader';

export default function AppLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return loading ? <Loader /> : <>{children}</>;
}
