"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { eventAPI } from "@/lib/api";

type Category = { id: string; name: string };

type EventFormValues = {
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  location: string;
  venue: string;
  startDate: string;
  endDate: string;
  price: number;
  totalTickets: number;
  isPublished: boolean;
  tags: string;
};

type Props = {
  categories: Category[];
  initialEvent?: any;
};

export function EventForm({ categories, initialEvent }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const defaults: EventFormValues = useMemo(
    () => ({
      title: initialEvent?.title ?? "",
      description: initialEvent?.description ?? "",
      category: initialEvent?.category ?? categories[0]?.id ?? "",
      imageUrl: initialEvent?.imageUrl ?? "",
      location: initialEvent?.location ?? "",
      venue: initialEvent?.venue ?? "",
      startDate: initialEvent?.startDate
        ? new Date(initialEvent.startDate).toISOString().slice(0, 16)
        : "",
      endDate: initialEvent?.endDate
        ? new Date(initialEvent.endDate).toISOString().slice(0, 16)
        : "",
      price: initialEvent ? Number(initialEvent.price) : 0,
      totalTickets: initialEvent?.totalTickets ?? 10,
      isPublished: initialEvent?.isPublished ?? false,
      tags: initialEvent?.tags?.join(", ") ?? "",
    }),
    [categories, initialEvent]
  );

  const [form, setForm] = useState<EventFormValues>(defaults);
  useEffect(() => setForm(defaults), [defaults]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "price"
          ? Number(value)
          : name === "totalTickets"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    try {
      if (initialEvent) {
        await eventAPI.update(initialEvent.id, payload);
      } else {
        await eventAPI.create(payload);
      }
      router.push("/events/my-events");
      router.refresh();
    } catch (err: any) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        router.push("/login?callbackUrl=/events/my-events");
        return;
      }
      setError(err?.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="imageUrl">
            Image URL
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            value={form.imageUrl}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="location">
            Location
          </label>
          <input
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="venue">
            Venue
          </label>
          <input
            id="venue"
            name="venue"
            value={form.venue}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="startDate">
            Start date
          </label>
          <input
            id="startDate"
            name="startDate"
            type="datetime-local"
            value={form.startDate}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="endDate">
            End date
          </label>
          <input
            id="endDate"
            name="endDate"
            type="datetime-local"
            value={form.endDate}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="price">
            Price (USD)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="totalTickets">
            Total tickets
          </label>
          <input
            id="totalTickets"
            name="totalTickets"
            type="number"
            min="1"
            value={form.totalTickets}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="tags">
            Tags (comma separated)
          </label>
          <input
            id="tags"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="music, conference, networking"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="isPublished"
            name="isPublished"
            type="checkbox"
            checked={form.isPublished}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
            Publish immediately
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {loading ? "Saving..." : initialEvent ? "Update event" : "Create event"}
        </button>
      </div>
    </form>
  );
}
