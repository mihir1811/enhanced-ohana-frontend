'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function RouteLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Trigger loader on route change
    setLoading(true);

    // Simulate short delay for UX (you can adjust/remove)
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 400); // 400ms delay

    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="h-10 w-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
