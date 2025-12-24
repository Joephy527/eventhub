import { auth } from "@/auth";
import { logout } from "@/lib/actions/auth";
import { serverBookingAPI, serverEventAPI } from "@/lib/api-server";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import Link from "next/link";

async function getStats() {
  try {
    const res = await serverBookingAPI.getStats();
    return res.data.data ?? { totalBookings: 0, upcomingEvents: 0, totalSpent: 0 };
  } catch (error) {
    console.error("Failed to load booking stats:", error);
    return { totalBookings: 0, upcomingEvents: 0, totalSpent: 0 };
  }
}

async function getUpcomingEvents() {
  try {
    const res = await serverEventAPI.getUpcoming(4);
    return res.data.data ?? [];
  } catch (error) {
    console.error("Failed to load upcoming events:", error);
    return [];
  }
}

export default async function DashboardPage() {
  const session = await auth();
  const [stats, upcomingEvents] = await Promise.all([getStats(), getUpcomingEvents()]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50/20 to-blue-50/20">
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
                Browse Events
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
              {session?.user.role === "user" && (
                <Link
                  href="/bookings"
                  className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-all duration-200 hover:scale-105"
                >
                  My Bookings
                </Link>
              )}
              {session?.user.role && (session.user.role === "organizer" || session.user.role === "admin") && (
                <Link
                  href="/events/my-events"
                  className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-all duration-200 hover:scale-105"
                >
                  My Events
                </Link>
              )}
              <form action={logout}>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 font-medium transition-all duration-200"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header with Animation */}
        <div className="mb-12 animate-fade-in-down">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-slate-700 to-slate-600 bg-clip-text text-transparent">
            Welcome back, {session?.user.firstName}!
          </h1>
          <p className="text-gray-600 mt-3 text-lg">
            Here's an overview of your activity
          </p>
        </div>

        {/* Stats Cards with Staggered Animation */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Total Bookings */}
          <div
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-100/50 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in"
            style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Total Bookings
                </p>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-transparent mt-2">
                  {stats.totalBookings}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-slate-600 rounded-2xl p-4 shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100/50 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in"
            style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Upcoming Events
                </p>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mt-2">
                  {stats.upcomingEvents}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-4 shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Spent/Earned */}
          <div
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-green-100/50 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in"
            style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  {session?.user.role === "user" ? "Total Spent" : "Total Earned"}
                </p>
                <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-2">
                  {session?.user.role === "user"
                    ? formatCurrency(stats.totalSpent)
                    : formatCurrency(stats.totalEarned || 0)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-4 shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid with Animation */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Upcoming Events List */}
          <div
            className="lg:col-span-2 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 p-8 shadow-lg animate-fade-in-up"
            style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
              <Link
                href="/events"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                View All →
              </Link>
            </div>
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-600">No upcoming events yet.</p>
                <Link
                  href="/events"
                  className="inline-block mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Browse Events
                </Link>
              </div>
            ) : (
              <ul className="space-y-4">
                {upcomingEvents.map((event: any, index: number) => (
                  <li
                    key={event.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50/50 to-blue-50/50 border border-slate-100/50 hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                    style={{ animation: `fade-in-up 0.3s ease-out ${index * 0.1 + 0.5}s both` }}
                  >
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 mb-1">{event.title}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1 1 0 01-1.414 0l-4.243-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location} · {formatDateTime(event.startDate)}
                      </p>
                    </div>
                    <Link
                      href={`/events/${event.id}`}
                      className="ml-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                    >
                      View
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Account Info */}
          <div
            className="rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 p-8 shadow-lg animate-fade-in-up"
            style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Account</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-slate-700 flex items-center justify-center text-white font-bold text-lg">
                  {session?.user.firstName?.[0]}{session?.user.lastName?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-600">Name</p>
                  <p className="font-bold text-gray-900 truncate">
                    {session?.user.firstName} {session?.user.lastName}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <p className="text-sm font-semibold text-gray-600 mb-1">Email</p>
                <p className="text-gray-900 truncate">{session?.user.email}</p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-100">
                <p className="text-sm font-semibold text-gray-600 mb-1">Role</p>
                <p className="font-bold text-blue-700 capitalize">{session?.user.role}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
