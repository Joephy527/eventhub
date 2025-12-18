"use client";

import { FormEvent, useMemo, useState } from "react";
import { eventAPI } from "@/lib/api";
import { EventCard } from "./event-card";

type Event = any;
type Category = { id: string; name: string; slug: string };

type Filters = {
  category: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  minAvailableTickets: string;
};

const emptyFilters: Filters = {
  category: "",
  location: "",
  minPrice: "",
  maxPrice: "",
  minAvailableTickets: "",
};

export function EventsBrowser({
  initialEvents,
  categories,
}: {
  initialEvents: Event[];
  categories: Category[];
}) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtersActive = useMemo(
    () => Object.values(filters).some((value) => value !== ""),
    [filters]
  );

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const buildParams = (activeFilters: Filters, activeSearch: string) => {
    const params: Record<string, string | number> = {};
    if (activeSearch.trim()) params.search = activeSearch.trim();
    if (activeFilters.category) params.category = activeFilters.category;
    if (activeFilters.location.trim()) params.location = activeFilters.location.trim();
    if (activeFilters.minPrice) params.minPrice = Number(activeFilters.minPrice);
    if (activeFilters.maxPrice) params.maxPrice = Number(activeFilters.maxPrice);
    if (activeFilters.minAvailableTickets) {
      params.minAvailableTickets = Number(activeFilters.minAvailableTickets);
    }
    return params;
  };

  const fetchEvents = async (
    activeFilters: Filters = filters,
    activeSearch: string = search
  ) => {
    setLoading(true);
    setError(null);
    try {
      const params = buildParams(activeFilters, activeSearch);
      const res = await eventAPI.getAll(Object.keys(params).length ? params : undefined);
      setEvents(res.data.data ?? []);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = async () => {
    const cleared = { ...emptyFilters };
    setFilters(cleared);
    await fetchEvents(cleared, search);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await fetchEvents(filters, search);
  };

  const handleSearch = async () => {
    await fetchEvents(filters, search);
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">Search</label>
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
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title or description"
                  className="ml-3 w-full border-none bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSearch}
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
                      await fetchEvents(filters, "");
                    }}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    disabled={loading}
                  >
                    Clear search
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-0"
                >
                  <option value="">All categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">Location</label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                  placeholder="City or venue"
                  className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-0"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">
                  Price range (USD)
                </label>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    min={0}
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                    placeholder="Min"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-0"
                  />
                  <input
                    type="number"
                    min={0}
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                    placeholder="Max"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4 md:items-end">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Min tickets left
                </label>
                <input
                  type="number"
                  min={0}
                  value={filters.minAvailableTickets}
                  onChange={(e) => handleFilterChange("minAvailableTickets", e.target.value)}
                  placeholder="e.g. 10"
                  className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-0"
                />
              </div>

              <div className="md:col-span-3 flex flex-wrap items-center justify-end gap-3">
                {filtersActive && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    disabled={loading}
                  >
                    Clear filters
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300"
                >
                  {loading ? "Searching..." : "Apply filters"}
                </button>
              </div>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {events.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm ring-1 ring-gray-200">
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
            No events match your filters
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Try adjusting your search or clearing the filters to see more events.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event: Event) => (
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
    </div>
  );
}
