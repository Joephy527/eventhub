import { eventAPI } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { BookTickets } from "@/components/book-tickets";

async function getEvent(id: string) {
  try {
    const res = await eventAPI.getById(id);
    return res.data.data;
  } catch (error) {
    console.error("Failed to load event:", error);
    return null;
  }
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [event, session] = await Promise.all([getEvent(id), auth()]);

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="text-2xl font-bold text-purple-600">
              EventHub
            </Link>
            <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
              <Link href="/events" className="hover:text-gray-900">
                Browse
              </Link>
              {session?.user.role && (session.user.role === "organizer" || session.user.role === "admin") && (
                <>
                  <Link
                    href="/events/my-events"
                    className="rounded-lg bg-purple-50 px-3 py-1 text-purple-700 hover:bg-purple-100"
                  >
                    My Events
                  </Link>
                  <Link
                    href="/events/create"
                    className="rounded-lg bg-purple-600 px-3 py-1 text-white shadow-sm hover:bg-purple-700"
                  >
                    Create
                  </Link>
                </>
              )}
              {session?.user.role === "user" && (
                <Link
                  href="/bookings"
                  className="rounded-lg bg-gray-100 px-3 py-1 text-gray-700 hover:bg-gray-200"
                >
                  My bookings
                </Link>
              )}
              <Link href="/dashboard" className="rounded-lg px-3 py-1 hover:bg-gray-100">
                Dashboard
              </Link>
            </div>
          </div>
        </nav>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
          <div className="relative h-80 w-full overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute left-6 top-6 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-purple-700 shadow-sm">
              {formatDateTime(event.startDate)}
            </div>
          </div>

          <div className="space-y-6 p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-purple-600">Event</p>
                <h1 className="mt-1 text-3xl font-bold text-gray-900">{event.title}</h1>
                <p className="mt-2 text-gray-600">{event.location} · {event.venue}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-50 px-4 py-2 text-lg font-semibold text-purple-700">
                  {formatCurrency(Number(event.price))}
                </div>
                <span className="rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
                  {event.availableTickets} tickets left
                </span>
              </div>
            </div>

            <div className="space-y-8">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <h2 className="text-lg font-semibold text-gray-900">About</h2>
                  <p className="mt-2 text-gray-700 leading-relaxed whitespace-pre-line">
                    {event.description}
                  </p>
                </div>
                <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <h3 className="text-sm font-semibold text-gray-900">Details</h3>
                  <dl className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start justify-between gap-3">
                      <dt className="font-medium text-gray-600">Starts</dt>
                      <dd className="text-right">{formatDateTime(event.startDate)}</dd>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <dt className="font-medium text-gray-600">Ends</dt>
                      <dd className="text-right">{formatDateTime(event.endDate)}</dd>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <dt className="font-medium text-gray-600">Venue</dt>
                      <dd className="text-right">{event.venue}</dd>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <dt className="font-medium text-gray-600">Location</dt>
                      <dd className="text-right">{event.location}</dd>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {event.tags?.map((tag: string) => (
                        <span
                          key={tag}
                          className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700"
                        >
                          {tag}
                        </span>
                      )) || (
                        <span className="text-xs text-gray-500">No tags</span>
                      )}
                    </div>
                  </dl>
                </div>
              </div>

              {session?.user.role !== "organizer" && (
                <div className="mt-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm max-w-xl mx-auto">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Book tickets</h2>
                  <BookTickets
                    eventId={event.id}
                    maxTickets={event.availableTickets}
                    price={Number(event.price)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
