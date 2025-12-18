"use client";

import { useState } from "react";
import Link from "next/link";
import { eventAPI } from "@/lib/api";
import { EventCard } from "@/components/event-card";

type Event = any;

export function MyEventsList({ initialEvents }: { initialEvents: Event[] }) {
  const [events, setEvents] = useState(initialEvents);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "published" | "draft">("all");
  const [loading, setLoading] = useState(false);

  const handleDelete = (id: string) => {
    setConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!confirmId) return;
    setError(null);
    setDeleting(confirmId);
    try {
      await eventAPI.delete(confirmId);
      setEvents((prev: Event[]) => prev.filter((e) => e.id !== confirmId));
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to delete event");
    } finally {
      setDeleting(null);
      setConfirmId(null);
    }
  };

  const fetchFilteredEvents = async (nextSearch = search, nextStatus = status) => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      if (nextSearch.trim()) params.search = nextSearch.trim();
      if (nextStatus !== "all") params.status = nextStatus;
      const res = await eventAPI.getMyEvents(Object.keys(params).length ? params : undefined);
      setEvents(res.data.data ?? []);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m0 0a7 7 0 10-9.9-9.9 7 7 0 009.9 9.9z"
              />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, description, or location"
              className="ml-3 w-full border-none bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => fetchFilteredEvents()}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300"
            >
              {loading ? "Searching..." : "Search"}
            </button>
            {search.trim() !== "" && (
              <button
                type="button"
                onClick={async () => {
                  setSearch("");
                  await fetchFilteredEvents("", status);
                }}
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Clear search
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:w-48">
            <label className="text-sm font-semibold text-gray-700">Status</label>
            <select
              value={status}
              onChange={async (e) => {
                const nextStatus = e.target.value as typeof status;
                setStatus(nextStatus);
                await fetchFilteredEvents(search, nextStatus);
              }}
              className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-0"
            >
              <option value="all">All</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
          {status !== "all" && (
            <button
              type="button"
              onClick={async () => {
                setStatus("all");
                await fetchFilteredEvents(search, "all");
              }}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {events.length === 0 ? (
        search.trim() || status !== "all" ? (
          <div className="rounded-lg border border-gray-200 bg-white px-4 py-6 text-center text-sm text-gray-600">
            No events match the current filters. Try adjusting the search or status.
          </div>
        ) : (
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No events created yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first event!
            </p>
            <div className="mt-6">
              <Link
                href="/events/create"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create New Event
              </Link>
            </div>
          </div>
        )
      ) : (
        <div className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event: Event) => (
            <div
              key={event.id}
              className="flex h-full flex-col rounded-xl bg-white shadow-sm ring-1 ring-gray-200"
            >
              <div className="flex-1">
                <EventCard
                  id={event.id}
                  title={event.title}
                  description={event.description}
                  imageUrl={event.imageUrl}
                  location={event.location}
                  startDate={event.startDate}
                  price={event.price}
                  tags={event.tags}
                  className="shadow-none ring-0 hover:shadow-sm h-full"
                />
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
                <Link
                  href={`/events/edit/${event.id}`}
                  className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(event.id)}
                  disabled={deleting === event.id}
                  className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleting === event.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900">Delete event?</h3>
            <p className="mt-2 text-sm text-gray-600">
              This action cannot be undone. The event will be removed permanently.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                disabled={!!deleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={!!deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
