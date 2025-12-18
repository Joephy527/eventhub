import { auth } from "@/auth";
import Link from "next/link";
import { eventAPI } from "@/lib/api";
import { MyEventsList } from "@/components/my-events-list";

async function getMyEvents() {
  try {
    const res = await eventAPI.getMyEvents();
    return res.data.data ?? [];
  } catch (error) {
    console.error("Failed to load organizer events:", error);
    return [];
  }
}

export default async function MyEventsPage() {
  const session = await auth();
  const events = await getMyEvents();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-2xl font-bold text-purple-600">
              EventHub
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <span className="text-gray-700">{session?.user.firstName}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
            <p className="text-gray-600 mt-2">
              Manage and track events you are organizing.
            </p>
          </div>
          <Link
            href="/events/create"
            className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700"
          >
            + Create Event
          </Link>
        </div>

        <MyEventsList initialEvents={events} />
      </main>
    </div>
  );
}
