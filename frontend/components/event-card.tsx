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
      data-testid="event-card"
      className={cn(
        "event-card group block h-full overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl",
        className
      )}
    >
      <div className="relative h-52 w-full overflow-hidden">
        {/* Image with overlay gradient */}
        <div className="relative h-full w-full">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
          />
          {/* Gradient overlay that appears on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        {/* Date badge with enhanced styling */}
        <div className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-blue-600 to-slate-700 px-4 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
          {formatDateTime(startDate)}
        </div>

        {/* Price badge in top right */}
        <div className="absolute right-4 top-4 rounded-full bg-white/95 backdrop-blur-sm px-4 py-2 text-sm font-bold text-blue-700 shadow-lg transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110">
          {formatCurrency(Number(price))}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Title */}
        <h3 className="line-clamp-2 text-xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-blue-600">
          {title}
        </h3>

        {/* Description */}
        <p className="line-clamp-2 text-sm leading-relaxed text-gray-600">
          {description}
        </p>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 transition-colors duration-200 group-hover:bg-blue-100">
            <svg
              className="h-4 w-4 text-blue-600"
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
            <span className="font-medium text-gray-700">{location}</span>
          </div>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={tag}
                className="rounded-full bg-gradient-to-r from-slate-50 to-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-slate-200/50 transition-all duration-200 hover:from-slate-100 hover:to-blue-100 hover:ring-blue-300"
                style={{
                  animation: `fade-in-up 0.3s ease-out ${index * 0.05}s both`
                }}
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 ring-1 ring-gray-200">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
