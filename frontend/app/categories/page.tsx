import { serverCategoryAPI, serverEventAPI } from "@/lib/api-server";
import Link from "next/link";
import { auth } from "@/auth";
import { logout } from "@/lib/actions/auth";

async function getCategories() {
  try {
    const res = await serverCategoryAPI.getAll();
    return res.data.data ?? [];
  } catch (error) {
    console.error("Failed to load categories:", error);
    return [];
  }
}

async function getAllEvents() {
  try {
    const res = await serverEventAPI.getAll();
    return res.data.data ?? [];
  } catch (error) {
    console.error("Failed to load events:", error);
    return [];
  }
}

export default async function CategoriesPage() {
  const [categories, events, session] = await Promise.all([
    getCategories(),
    getAllEvents(),
    auth(),
  ]);

  // Count events per category
  const categoriesWithCount = categories.map((category: any) => ({
    ...category,
    eventCount: events.filter((event: any) => event.category === category.id).length,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50/30 to-blue-50/30">
      {/* Enhanced Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-transparent hover:from-blue-700 hover:to-slate-800 transition-all"
              >
                EventHub
              </Link>
              <Link
                href="/events"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Events
              </Link>
              <Link
                href="/categories"
                className="relative text-blue-600 font-semibold after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-gradient-to-r after:from-blue-600 after:to-slate-700 after:content-['']"
              >
                Categories
              </Link>
              {session?.user.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Admin
                </Link>
              )}
            </div>
            <div className="flex items-center gap-3">
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="rounded-xl px-4 py-2 text-gray-700 hover:bg-blue-50 transition-all duration-200 font-medium"
                  >
                    Dashboard
                  </Link>
                  <form action={logout}>
                    <button
                      type="submit"
                      className="rounded-xl px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-medium"
                    >
                      Sign Out
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/login"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-slate-700 px-6 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 animate-fade-in-down">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-slate-700 to-slate-600 bg-clip-text text-transparent">
            Event Categories
          </h1>
          <p className="text-gray-600 mt-3 text-lg">
            Browse events by category and discover your next experience
          </p>
        </div>

        {categoriesWithCount.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg font-medium">No categories found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            {categoriesWithCount.map((category: any, index: number) => (
              <Link
                key={category.id}
                href={`/events?category=${category.id}`}
                className="category-card group bg-white/80 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-slate-200/50 hover:-translate-y-1 hover:border-blue-500/50"
                data-testid="category-card"
                style={{ animation: `fade-in-up 0.3s ease-out ${index * 0.05}s both` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-slate-100 flex items-center justify-center group-hover:from-blue-200 group-hover:to-slate-200 transition-colors">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    {category.eventCount} {category.eventCount === 1 ? 'event' : 'events'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {category.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
