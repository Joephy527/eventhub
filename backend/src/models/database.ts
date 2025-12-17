import { User, Event, Booking, Category } from '../types';

class Database {
  private users: Map<string, User> = new Map();
  private events: Map<string, Event> = new Map();
  private bookings: Map<string, Booking> = new Map();
  private categories: Map<string, Category> = new Map();

  constructor() {
    this.seedCategories();
  }

  private seedCategories() {
    const categories: Category[] = [
      {
        id: '1',
        name: 'Music & Concerts',
        slug: 'music-concerts',
        description: 'Live music performances and concerts',
        icon: 'music'
      },
      {
        id: '2',
        name: 'Technology & Innovation',
        slug: 'technology',
        description: 'Tech conferences, workshops, and meetups',
        icon: 'laptop'
      },
      {
        id: '3',
        name: 'Sports & Fitness',
        slug: 'sports-fitness',
        description: 'Sports events, marathons, and fitness activities',
        icon: 'trophy'
      },
      {
        id: '4',
        name: 'Arts & Culture',
        slug: 'arts-culture',
        description: 'Art exhibitions, theater, and cultural events',
        icon: 'palette'
      },
      {
        id: '5',
        name: 'Food & Drink',
        slug: 'food-drink',
        description: 'Food festivals, wine tastings, and culinary events',
        icon: 'utensils'
      },
      {
        id: '6',
        name: 'Business & Professional',
        slug: 'business',
        description: 'Business conferences, networking, and seminars',
        icon: 'briefcase'
      },
      {
        id: '7',
        name: 'Education & Learning',
        slug: 'education',
        description: 'Workshops, classes, and educational seminars',
        icon: 'book'
      },
      {
        id: '8',
        name: 'Community & Social',
        slug: 'community',
        description: 'Community gatherings and social events',
        icon: 'users'
      }
    ];

    categories.forEach(category => {
      this.categories.set(category.id, category);
    });
  }

  // User Methods
  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  createUser(user: User): User {
    this.users.set(user.id, user);
    return user;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  deleteUser(id: string): boolean {
    return this.users.delete(id);
  }

  // Event Methods
  getAllEvents(): Event[] {
    return Array.from(this.events.values());
  }

  getEventById(id: string): Event | undefined {
    return this.events.get(id);
  }

  getEventsByOrganizer(organizerId: string): Event[] {
    return Array.from(this.events.values()).filter(
      event => event.organizerId === organizerId
    );
  }

  createEvent(event: Event): Event {
    this.events.set(event.id, event);
    return event;
  }

  updateEvent(id: string, updates: Partial<Event>): Event | undefined {
    const event = this.events.get(id);
    if (!event) return undefined;

    const updatedEvent = { ...event, ...updates, updatedAt: new Date() };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  deleteEvent(id: string): boolean {
    return this.events.delete(id);
  }

  // Booking Methods
  getAllBookings(): Booking[] {
    return Array.from(this.bookings.values());
  }

  getBookingById(id: string): Booking | undefined {
    return this.bookings.get(id);
  }

  getBookingsByUser(userId: string): Booking[] {
    return Array.from(this.bookings.values()).filter(
      booking => booking.userId === userId
    );
  }

  getBookingsByEvent(eventId: string): Booking[] {
    return Array.from(this.bookings.values()).filter(
      booking => booking.eventId === eventId
    );
  }

  createBooking(booking: Booking): Booking {
    this.bookings.set(booking.id, booking);
    return booking;
  }

  updateBooking(id: string, updates: Partial<Booking>): Booking | undefined {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;

    const updatedBooking = { ...booking, ...updates, updatedAt: new Date() };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  deleteBooking(id: string): boolean {
    return this.bookings.delete(id);
  }

  // Category Methods
  getAllCategories(): Category[] {
    return Array.from(this.categories.values());
  }

  getCategoryById(id: string): Category | undefined {
    return this.categories.get(id);
  }

  getCategoryBySlug(slug: string): Category | undefined {
    return Array.from(this.categories.values()).find(
      category => category.slug === slug
    );
  }
}

export const db = new Database();
