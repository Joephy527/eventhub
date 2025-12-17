import { eventAPI } from "@/lib/api";
import { EventCard } from "@/components/event-card";
import { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Events | EventHub",
};

async function getEvents() {
  try {
    const res = await eventAPI.getAll();
    return res.data.data ?? [];
  } catch (error) {
    console.error("Failed to load events:", error);
    return [];
  }
}

export default async function EventsPage() {
  const [events, session] = await Promise.all([getEvents(), auth()]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-2xl font-bold text-purple-600">
            EventHub
          </Link>
          <div className="flex items-center gap-3">
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
            {session?.user.role === "user" && (
              <Link
                href="/bookings"
                className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
              >
                My bookings
              </Link>
            )}
            <Link
              href="/dashboard"
              className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Browse Events</h2>
            <p className="mt-2 text-gray-600">
              Discover concerts, conferences, workshops, and more.
            </p>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="mt-12 rounded-xl bg-white p-10 text-center shadow-sm ring-1 ring-gray-200">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 text-purple-600">
              <svg
                className="h-6 w-6"
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
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No events available yet
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Check back soon for new experiences.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
