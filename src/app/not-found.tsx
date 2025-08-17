import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-background dark:bg-[#18181b] px-4">
      <div className="flex flex-col items-center">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4 animate-bounce" />
        <h2 className="text-4xl font-bold text-foreground dark:text-white mb-2">404 - Not Found</h2>
        <p className="text-lg text-muted-foreground dark:text-gray-400 mb-6 text-center max-w-md">
          Sorry, the page you are looking for does not exist or has been moved.<br />
          Please check the URL or return to the homepage.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2 rounded-lg bg-primary text-primary-foreground dark:bg-yellow-600 dark:text-white font-semibold shadow hover:bg-primary/90 dark:hover:bg-yellow-700 transition"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
