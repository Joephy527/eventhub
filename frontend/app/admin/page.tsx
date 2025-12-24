import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();

  // Check if user is admin
  if (session?.user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              EventHub
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/admin" className="text-blue-600 hover:text-blue-700">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage users, events, and system settings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/users"
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              User Management
            </h3>
            <p className="text-gray-600 text-sm">
              View and manage all registered users
            </p>
          </Link>

          <Link
            href="/admin/bookings"
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              All Bookings
            </h3>
            <p className="text-gray-600 text-sm">
              View all bookings across the platform
            </p>
          </Link>

          <Link
            href="/events"
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              All Events
            </h3>
            <p className="text-gray-600 text-sm">
              Manage all events on the platform
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
