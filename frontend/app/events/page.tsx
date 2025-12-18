import { categoryAPI, eventAPI } from "@/lib/api";
import { EventsBrowser } from "@/components/events-browser";
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

async function getCategories() {
  try {
    const res = await categoryAPI.getAll();
    return res.data.data ?? [];
  } catch (error) {
    console.error("Failed to load categories:", error);
    return [];
  }
}

export default async function EventsPage() {
  const [events, categories, session] = await Promise.all([
    getEvents(),
    getCategories(),
    auth(),
  ]);

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
            {session ? (
              <Link
                href="/dashboard"
                className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Sign in
              </Link>
            )}
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

        <div className="mt-10">
          <EventsBrowser initialEvents={events} categories={categories} />
        </div>
      </main>
    </div>
  );
}
