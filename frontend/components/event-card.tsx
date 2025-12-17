"use client";

import Link from "next/link";
import { formatDateTime, formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

export type EventCardProps = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  startDate: string | Date;
  price: string | number;
  tags?: string[] | null;
  isPublished?: boolean;
  className?: string;
};

export function EventCard({
  id,
  title,
  description,
  imageUrl,
  location,
  startDate,
  price,
  tags,
  className,
}: EventCardProps) {
  return (
    <Link
      href={`/events/${id}`}
      className={cn(
        "group block h-full overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-1 hover:shadow-lg",
        className
      )}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-purple-700 shadow-sm">
          {formatDateTime(startDate)}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">{title}</h3>
          <span className="shrink-0 rounded-md bg-purple-50 px-2 py-1 text-xs font-semibold text-purple-700">
            {formatCurrency(Number(price))}
          </span>
        </div>

        <p className="line-clamp-2 text-sm text-gray-600">{description}</p>

        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
            <svg
              className="h-4 w-4 text-purple-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1 1 0 01-1.414 0l-4.243-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {location}
          </span>

          {tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-purple-50 px-2 py-1 text-purple-700"
            >
              {tag}
            </span>
          ))}
          {tags && tags.length > 3 && (
            <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-600">
              +{tags.length - 3} more
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
