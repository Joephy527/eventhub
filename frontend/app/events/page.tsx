import { EventsBrowser } from "@/components/events-browser";
import { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { logout } from "@/lib/actions/auth";
import { serverEventAPI, serverCategoryAPI } from "@/lib/api-server";

export const metadata: Metadata = {
  title: "Events | EventHub",
};

async function getEvents(params?: any) {
  try {
    const res = await serverEventAPI.getAll(params);
    return res.data.data ?? [];
  } catch (error) {
    console.error("Failed to load events:", error);
    return [];
  }
}

async function getCategories() {
  try {
    const res = await serverCategoryAPI.getAll();
    return res.data.data ?? [];
  } catch (error) {
    console.error("Failed to load categories:", error);
    return [];
  }
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  // Build params for backend filtering
  const params = category ? { category } : undefined;

  const [events, categories, session] = await Promise.all([
    getEvents(params),
    getCategories(),
    auth(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50/30 to-blue-50/30">
      {/* Enhanced Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-transparent hover:from-blue-700 hover:to-slate-800 transition-all"
            >
              EventHub
            </Link>
            <Link
              href="/events"
              className="relative text-blue-600 font-semibold after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-gradient-to-r after:from-blue-600 after:to-slate-700 after:content-['']"
            >
              Events
            </Link>
            <Link
              href="/categories"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
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
            {session?.user.role && (session.user.role === "organizer" || session.user.role === "admin") && (
              <Link
                href="/events/my-events"
                className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-all duration-200 hover:scale-105"
              >
                My Events
              </Link>
            )}
            {session?.user.role === "user" && (
              <Link
                href="/bookings"
                className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-all duration-200 hover:scale-105"
              >
                My Bookings
              </Link>
            )}
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
      </nav>

      {/* Hero Section with Animation */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-slate-700 to-blue-700 py-16">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-5xl font-extrabold text-white sm:text-6xl mb-4">
              Discover Amazing Events
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-blue-100">
              From concerts to conferences, find and book the perfect experience for you
            </p>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-scale-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                <div className="text-4xl font-bold text-white">{events.length}+</div>
                <div className="mt-1 text-blue-100 font-medium">Active Events</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-scale-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                <div className="text-4xl font-bold text-white">{categories.length}+</div>
                <div className="mt-1 text-blue-100 font-medium">Categories</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-scale-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                <div className="text-4xl font-bold text-white">24/7</div>
                <div className="mt-1 text-blue-100 font-medium">Booking Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <EventsBrowser
            initialEvents={events}
            categories={categories}
            initialCategory={category}
          />
        </div>
      </main>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-slate-700 py-12 mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Host Your Own Event?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Join thousands of organizers who trust EventHub to manage their events seamlessly
          </p>
          {session?.user.role === "organizer" || session?.user.role === "admin" ? (
            <Link
              href="/events/create"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 text-lg font-semibold text-blue-600 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              Create Your Event
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          ) : (
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 text-lg font-semibold text-blue-600 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              Get Started
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
