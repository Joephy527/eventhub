import { auth } from "@/auth";
import { logout } from "@/lib/actions/auth";
import { bookingAPI, eventAPI } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import Link from "next/link";

async function getStats() {
  try {
    const res = await bookingAPI.getStats();
    return res.data.data ?? { totalBookings: 0, upcomingEvents: 0, totalSpent: 0 };
  } catch (error) {
    console.error("Failed to load booking stats:", error);
    return { totalBookings: 0, upcomingEvents: 0, totalSpent: 0 };
  }
}

async function getUpcomingEvents() {
  try {
    const res = await eventAPI.getUpcoming(4);
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-purple-600">EventHub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {session?.user.firstName} {session?.user.lastName}
              </span>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                {session?.user.role}
              </span>
              {session?.user.role === "user" && (
                <Link
                  href="/bookings"
                  className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                >
                  My bookings
                </Link>
              )}
              {session?.user.role && (session.user.role === "organizer" || session.user.role === "admin") && (
                <>
                  <Link
                    href="/events/my-events"
                    className="rounded-lg bg-purple-50 px-3 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-100"
                  >
                    My Events
                  </Link>
                  <Link
                    href="/events/create"
                    className="rounded-lg bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700"
                  >
                    Create
                  </Link>
                </>
              )}
              <form action={logout}>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session?.user.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your events
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Bookings
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBookings}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-purple-600"
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

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Upcoming Events
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.upcomingEvents}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-blue-600"
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

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {session?.user.role === "user" ? "Total Spent" : "Total Earned"}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {session?.user.role === "user"
                    ? formatCurrency(stats.totalSpent)
                    : formatCurrency(stats.totalEarned || 0)}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-green-600"
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

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-gray-600">No upcoming events yet.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {upcomingEvents.map((event: any) => (
                  <li key={event.id} className="flex items-center justify-between py-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                      <p className="text-xs text-gray-600">
                        {event.location} · {formatDateTime(event.startDate)}
                      </p>
                    </div>
                    <a
                      href={`/events/${event.id}`}
                      className="text-sm font-semibold text-purple-700 hover:text-purple-800"
                    >
                      View
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-bold mb-4">Account</h2>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Email:</span>
                <span className="text-gray-600">{session?.user.email}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Role:</span>
                <span className="text-gray-600 capitalize">{session?.user.role}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
