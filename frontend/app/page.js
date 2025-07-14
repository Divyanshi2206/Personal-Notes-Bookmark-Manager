import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 text-gray-800 px-4">
      <h1 className="text-4xl font-bold mb-4 text-blue-800 text-center">
        📚 Personal Notes & Bookmark Manager
      </h1>
      <p className="text-lg text-center mb-8 max-w-xl">
        Organize your thoughts and favorite links in one place. Add, search, tag, and manage your personal notes and bookmarks easily.
      </p>
      <div className="flex gap-6">
        <Link
          href="/notes"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition"
        >
          Go to Notes
        </Link>
        <Link
          href="/bookmarks"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition"
        >
          Go to Bookmarks
        </Link>
      </div>
    </main>
  );
}
