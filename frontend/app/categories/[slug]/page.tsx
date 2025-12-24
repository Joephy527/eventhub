import { serverCategoryAPI, serverEventAPI } from "@/lib/api-server";
import Link from "next/link";
import { EventCard } from "@/components/event-card";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { logout } from "@/lib/actions/auth";

async function getCategory(slug: string) {
  try {
    const res = await serverCategoryAPI.getBySlug(slug);
    return res.data.data;
  } catch (error) {
    console.error("Failed to load category:", error);
    return null;
  }
}

async function getCategoryEvents(categoryId: string) {
  try {
    const res = await serverEventAPI.getAll({ category: categoryId });
    return res.data.data ?? [];
  } catch (error) {
    console.error("Failed to load events:", error);
    return [];
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [category, session] = await Promise.all([getCategory(slug), auth()]);

  if (!category) {
    notFound();
  }

  const events = await getCategoryEvents(category.id);

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

      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50" aria-label="Breadcrumb">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/categories" className="text-blue-600 hover:text-blue-700 font-medium">
                Categories
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-semibold">{category.name}</li>
          </ol>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 animate-fade-in-down">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-slate-700 to-slate-600 bg-clip-text text-transparent">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-gray-600 mt-3 text-lg category-description" data-testid="category-description">
              {category.description}
            </p>
          )}
          <p className="text-sm text-blue-600 font-semibold mt-3">
            {events.length} {events.length === 1 ? 'event' : 'events'} in this category
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg font-medium">No events found in this category</p>
            <p className="text-gray-500 text-sm mt-2">Check back later for new events</p>
            <Link
              href="/events"
              className="inline-block mt-6 px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-slate-700 text-white font-semibold hover:shadow-lg transition-all hover:scale-105"
            >
              Browse All Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            {events.map((event: any) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                description={event.description}
                imageUrl={event.imageUrl}
                location={event.location}
                startDate={event.startDate}
                price={event.price}
                tags={event.tags}
                isPublished={event.isPublished}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
