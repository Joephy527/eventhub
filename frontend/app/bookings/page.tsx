import { auth } from "@/auth";
import Link from "next/link";
import { bookingAPI, eventAPI } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/utils";

async function getBookings() {
  try {
    const res = await bookingAPI.getMyBookings();
    const bookings = res.data.data ?? [];

    // Fetch related events to enrich booking cards
    const eventCache: Record<string, any> = {};
    const withEvents = await Promise.all(
      bookings.map(async (booking: any) => {
        if (!eventCache[booking.eventId]) {
          try {
            const eventRes = await eventAPI.getById(booking.eventId);
            eventCache[booking.eventId] = eventRes.data.data;
          } catch (error) {
            console.error("Failed to load event for booking:", error);
          }
        }
        return { ...booking, event: eventCache[booking.eventId] };
      })
    );

    return withEvents;
  } catch (error) {
    console.error("Failed to load bookings:", error);
    return [];
  }
}

export default async function BookingsPage() {
  const session = await auth();
  const bookings = await getBookings();

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
              {session?.user.role && (session.user.role === "organizer" || session.user.role === "admin") && (
                <>
                  <Link href="/events/my-events" className="text-purple-600 hover:text-purple-700">
                    My Events
                  </Link>
                  <Link href="/events/create" className="text-purple-600 hover:text-purple-700">
                    Create
                  </Link>
                </>
              )}
              <span className="text-gray-700">{session?.user.firstName}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-2">
              View and manage your event bookings
            </p>
          </div>
          <Link
            href="/events"
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700"
          >
            Browse Events
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start by browsing events and booking tickets!
            </p>
            <div className="mt-6">
              <Link
                href="/events"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                Browse Events
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {bookings.map((booking: any) => (
              <div
                key={booking.id}
                className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
                      Booking
                    </p>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {booking.event?.title ?? "Event unavailable"}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {booking.event?.location} ·{" "}
                      {booking.event ? formatDateTime(booking.event.startDate) : "Date TBD"}
                    </p>
                  </div>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">Tickets</p>
                    <p className="mt-1 font-semibold">{booking.numberOfTickets}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">Total Paid</p>
                    <p className="mt-1 font-semibold">
                      {formatCurrency(Number(booking.totalAmount))}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">Booked On</p>
                    <p className="mt-1 font-semibold">{formatDateTime(booking.bookingDate)}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/events/${booking.eventId}`}
                    className="inline-flex items-center rounded-lg bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-100"
                  >
                    View Event
                  </Link>
                  {booking.status !== "cancelled" && (
                    <span className="inline-flex items-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
                      Manage booking soon
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
