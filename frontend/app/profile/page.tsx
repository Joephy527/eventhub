import { auth } from '@/auth';
import Link from 'next/link';
import { logout } from '@/lib/actions/auth';

export default async function ProfilePage() {
  const session = await auth();

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
              {session?.user.role === 'user' && (
                <Link href="/bookings" className="text-gray-600 hover:text-gray-900">
                  My bookings
                </Link>
              )}
              {session?.user.role && (session.user.role === 'organizer' || session.user.role === 'admin') && (
                <>
                  <Link href="/events/my-events" className="text-blue-600 hover:text-blue-700">
                    My Events
                  </Link>
                  <Link href="/events/create" className="text-blue-600 hover:text-blue-700">
                    Create
                  </Link>
                </>
              )}
              <Link href="/bookings" className="text-gray-600 hover:text-gray-900">
                Bookings
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account information
          </p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-slate-700 px-6 py-8">
            <div className="flex items-center">
              <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-blue-600">
                {session?.user.firstName?.[0]}
                {session?.user.lastName?.[0]}
              </div>
              <div className="ml-6">
                <h2 className="text-2xl font-bold text-white">
                  {session?.user.firstName} {session?.user.lastName}
                </h2>
                <p className="text-blue-100">{session?.user.email}</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Account Information
              </h3>
              <dl className="grid grid-cols-1 gap-4">
                <div className="border-b pb-4">
                  <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {session?.user.firstName} {session?.user.lastName}
                  </dd>
                </div>
                <div className="border-b pb-4">
                  <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {session?.user.email}
                  </dd>
                </div>
                <div className="border-b pb-4">
                  <dt className="text-sm font-medium text-gray-500">Account Type</dt>
                  <dd className="mt-1">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-800 capitalize">
                      {session?.user.role}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 flex items-center text-sm text-green-600">
                    <svg
                      className="h-5 w-5 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Active
                  </dd>
                </div>
              </dl>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Account Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Change Password
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Update Email
                </button>
                <form action={logout} className="w-full">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
