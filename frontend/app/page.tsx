import Link from 'next/link';
import { auth } from '@/auth';

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-blue-600 bg-clip-text text-transparent">
              EventHub
            </Link>
            <div className="flex items-center space-x-4">
              {session ? (
                <Link
                  href="/dashboard"
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-slate-700 to-blue-600 text-white font-semibold hover:shadow-lg transform hover:scale-105 transition"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-6 py-2 rounded-full text-blue-600 hover:bg-slate-50 font-semibold transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-slate-700 to-blue-600 text-white font-semibold hover:shadow-lg transform hover:scale-105 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50">
          {/* Floating Shapes */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '4s'}}></div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] bg-[size:50px_50px]"></div>

          {/* Animated Particles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-slate-500 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-blue-600 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 mb-6 leading-tight">
              <span className="inline-block animate-fade-in-down" style={{animationDelay: '0.1s', animationFillMode: 'both'}}>
                Discover
              </span>{' '}
              <span className="inline-block animate-fade-in-down" style={{animationDelay: '0.2s', animationFillMode: 'both'}}>
                Amazing
              </span>{' '}
              <br className="hidden sm:block" />
              <span className="inline-block bg-gradient-to-r from-slate-700 via-blue-600 to-slate-700 bg-clip-text text-transparent animate-gradient-x animate-fade-in-down" style={{animationDelay: '0.3s', animationFillMode: 'both'}}>
                Events
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.4s', animationFillMode: 'both'}}>
              Your premier destination for discovering and booking unforgettable
              experiences. From concerts to conferences, find your next adventure.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 animate-scale-in" style={{animationDelay: '0.5s', animationFillMode: 'both'}}>
              <Link
                href="/events"
                className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-slate-700 to-blue-600 text-white text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Browse Events
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
              {!session && (
                <Link
                  href="/register"
                  className="group px-8 py-4 rounded-full bg-white text-blue-600 text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-blue-600 relative overflow-hidden"
                >
                  <span className="relative z-10">Create Account</span>
                  <span className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                </Link>
              )}
            </div>

            {/* Floating Event Cards Preview */}
            <div className="relative h-64 mb-12">
              {/* Card 1 */}
              <div className="absolute top-0 left-1/4 transform -translate-x-1/2 animate-float">
                <div className="w-48 h-32 bg-white rounded-xl shadow-2xl p-4 border border-gray-100">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-slate-500 rounded-lg mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="absolute top-8 right-1/4 transform translate-x-1/2 animate-float" style={{animationDelay: '1s'}}>
                <div className="w-48 h-32 bg-white rounded-xl shadow-2xl p-4 border border-gray-100">
                  <div className="w-8 h-8 bg-gradient-to-r from-slate-500 to-blue-500 rounded-lg mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 animate-float" style={{animationDelay: '2s'}}>
                <div className="w-48 h-32 bg-white rounded-xl shadow-2xl p-4 border border-gray-100">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-slate-600 rounded-lg mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded w-4/5 mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded w-2/5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-slate-700 to-blue-600 relative overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div className="transform hover:scale-110 transition-transform duration-300 animate-scale-in" style={{animationDelay: '0.1s', animationFillMode: 'both'}}>
              <div className="text-5xl md:text-6xl font-bold mb-2 animate-fade-in-up">10K+</div>
              <div className="text-xl opacity-90">Events Listed</div>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300 animate-scale-in" style={{animationDelay: '0.2s', animationFillMode: 'both'}}>
              <div className="text-5xl md:text-6xl font-bold mb-2 animate-fade-in-up">50K+</div>
              <div className="text-xl opacity-90">Happy Attendees</div>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300 animate-scale-in" style={{animationDelay: '0.3s', animationFillMode: 'both'}}>
              <div className="text-5xl md:text-6xl font-bold mb-2 animate-fade-in-up">500+</div>
              <div className="text-xl opacity-90">Event Organizers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose EventHub?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to discover, book, and manage events in one place
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="group text-center transform hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{animationDelay: '0.1s', animationFillMode: 'both'}}>
              <div className="bg-gradient-to-br from-slate-100 to-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl group-hover:rotate-6 transition-all duration-300">
                <svg
                  className="w-10 h-10 text-blue-600 group-hover:scale-110 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">Smart Discovery</h3>
              <p className="text-gray-600 leading-relaxed">
                Find events that match your interests with our advanced search and personalized recommendations.
              </p>
            </div>

            <div className="group text-center transform hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{animationDelay: '0.2s', animationFillMode: 'both'}}>
              <div className="bg-gradient-to-br from-slate-100 to-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl group-hover:rotate-6 transition-all duration-300">
                <svg
                  className="w-10 h-10 text-blue-600 group-hover:scale-110 transition-transform"
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
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">Instant Booking</h3>
              <p className="text-gray-600 leading-relaxed">
                Secure your spot in seconds with our streamlined checkout and payment process.
              </p>
            </div>

            <div className="group text-center transform hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{animationDelay: '0.3s', animationFillMode: 'both'}}>
              <div className="bg-gradient-to-br from-slate-100 to-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl group-hover:rotate-6 transition-all duration-300">
                <svg
                  className="w-10 h-10 text-blue-600 group-hover:scale-110 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">Secure & Safe</h3>
              <p className="text-gray-600 leading-relaxed">
                Your data and payments are protected with industry-leading security measures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-200 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative animate-fade-in-up" style={{animationDelay: '0.1s', animationFillMode: 'both'}}>
              <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-blue-200">
                <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-r from-slate-700 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg animate-bounce-slow">
                  1
                </div>
                <h3 className="text-2xl font-bold mb-4 mt-4 text-gray-900">Browse Events</h3>
                <p className="text-gray-600 leading-relaxed">
                  Explore thousands of events across various categories and locations. Use filters to find exactly what you're looking for.
                </p>
              </div>
            </div>

            <div className="relative animate-fade-in-up" style={{animationDelay: '0.2s', animationFillMode: 'both'}}>
              <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-blue-200">
                <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-r from-slate-700 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg animate-bounce-slow" style={{animationDelay: '0.3s'}}>
                  2
                </div>
                <h3 className="text-2xl font-bold mb-4 mt-4 text-gray-900">Book Tickets</h3>
                <p className="text-gray-600 leading-relaxed">
                  Select your preferred date and number of tickets. Complete the secure checkout process in just a few clicks.
                </p>
              </div>
            </div>

            <div className="relative animate-fade-in-up" style={{animationDelay: '0.3s', animationFillMode: 'both'}}>
              <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-blue-200">
                <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-r from-slate-700 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg animate-bounce-slow" style={{animationDelay: '0.6s'}}>
                  3
                </div>
                <h3 className="text-2xl font-bold mb-4 mt-4 text-gray-900">Enjoy!</h3>
                <p className="text-gray-600 leading-relaxed">
                  Receive instant confirmation and digital tickets. Show up and enjoy an amazing experience!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of happy event-goers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 transform hover:scale-105 transition-all duration-300 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "EventHub made finding and booking concerts so easy! The interface is intuitive and the booking process was seamless."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  S
                </div>
                <div className="ml-4">
                  <div className="font-bold text-gray-900">Sarah Johnson</div>
                  <div className="text-gray-600 text-sm">Music Enthusiast</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 transform hover:scale-105 transition-all duration-300 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "As an event organizer, EventHub has been a game-changer. Managing tickets and attendees has never been easier!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  M
                </div>
                <div className="ml-4">
                  <div className="font-bold text-gray-900">Michael Chen</div>
                  <div className="text-gray-600 text-sm">Event Organizer</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 transform hover:scale-105 transition-all duration-300 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "I love how I can discover new events happening in my city. The personalized recommendations are spot on!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  E
                </div>
                <div className="ml-4">
                  <div className="font-bold text-gray-900">Emily Rodriguez</div>
                  <div className="text-gray-600 text-sm">Regular Attendee</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-700 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-slate-100 mb-8">
            Join thousands of event enthusiasts and discover your next unforgettable experience
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/events"
              className="px-8 py-4 rounded-full bg-white text-slate-700 text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Explore Events Now
            </Link>
            {!session && (
              <Link
                href="/register"
                className="px-8 py-4 rounded-full bg-transparent text-white text-lg font-semibold border-2 border-white hover:bg-white hover:text-slate-700 transform hover:scale-105 transition-all duration-300"
              >
                Sign Up Free
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-400 to-blue-400 bg-clip-text text-transparent mb-4">
                EventHub
              </h3>
              <p className="text-gray-400">
                Your premier destination for discovering and booking amazing events.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/events" className="hover:text-blue-400 transition">Browse Events</Link></li>
                <li><Link href="/register" className="hover:text-blue-400 transition">Sign Up</Link></li>
                <li><Link href="/login" className="hover:text-blue-400 transition">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EventHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
