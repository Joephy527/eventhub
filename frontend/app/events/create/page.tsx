import { categoryAPI } from "@/lib/api";
import { EventForm } from "@/components/event-form";
import Link from "next/link";

async function getCategories() {
  try {
    const res = await categoryAPI.getAll();
    return res.data.data ?? [];
  } catch (error) {
    console.error("Failed to load categories:", error);
    return [];
  }
}

export default async function CreateEventPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-2xl font-bold text-purple-600">
            EventHub
          </Link>
          <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
            <Link href="/events/my-events" className="hover:text-gray-900">
              My Events
            </Link>
            <Link href="/dashboard" className="rounded-lg px-3 py-1 hover:bg-gray-100">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
            Create Event
          </p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">Share a new experience</h1>
          <p className="mt-2 text-gray-600">
            Publish your event so attendees can discover and book it.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
          <EventForm categories={categories} />
        </div>
      </main>
    </div>
  );
}
