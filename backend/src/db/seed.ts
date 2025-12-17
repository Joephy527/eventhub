import { db } from './index';
import { categories, users, events } from './schema';
import { hashPassword } from '../utils/password';

async function seed() {
  console.log('Seeding database...');

  try {
    // Check if categories already exist
    const existingCategories = await db.select().from(categories).limit(1);
    if (existingCategories.length > 0) {
      console.log('✓ Database already seeded');
      process.exit(0);
    }

    // Seed categories
    const categoryData = [
      {
        name: 'Music & Concerts',
        slug: 'music-concerts',
        description: 'Live music performances and concerts',
        icon: 'music',
      },
      {
        name: 'Technology & Innovation',
        slug: 'technology',
        description: 'Tech conferences, workshops, and meetups',
        icon: 'laptop',
      },
      {
        name: 'Sports & Fitness',
        slug: 'sports-fitness',
        description: 'Sports events, marathons, and fitness activities',
        icon: 'trophy',
      },
      {
        name: 'Arts & Culture',
        slug: 'arts-culture',
        description: 'Art exhibitions, theater, and cultural events',
        icon: 'palette',
      },
      {
        name: 'Food & Drink',
        slug: 'food-drink',
        description: 'Food festivals, wine tastings, and culinary events',
        icon: 'utensils',
      },
      {
        name: 'Business & Professional',
        slug: 'business',
        description: 'Business conferences, networking, and seminars',
        icon: 'briefcase',
      },
      {
        name: 'Education & Learning',
        slug: 'education',
        description: 'Workshops, classes, and educational seminars',
        icon: 'book',
      },
      {
        name: 'Community & Social',
        slug: 'community',
        description: 'Community gatherings and social events',
        icon: 'users',
      },
    ];

    const insertedCategories = await db.insert(categories).values(categoryData).returning();
    console.log('✓ Categories seeded');

    // Seed demo users
    const password = await hashPassword('password123');

    const insertedUsers = await db.insert(users).values([
      {
        email: 'user@demo.com',
        password,
        firstName: 'Demo',
        lastName: 'User',
        role: 'user',
      },
      {
        email: 'organizer@demo.com',
        password,
        firstName: 'Demo',
        lastName: 'Organizer',
        role: 'organizer',
      },
    ]).returning();
    console.log('✓ Demo users seeded');

    const demoOrganizer = insertedUsers[1];

    // Seed demo events
    const now = new Date();
    const demoEvents = [
      {
        title: 'Summer Music Festival 2024',
        description: 'Join us for an unforgettable evening of live music featuring top artists from around the world. Experience multiple stages, food vendors, and an electric atmosphere.',
        category: insertedCategories[0].id,
        imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
        location: 'Los Angeles, CA',
        venue: 'Sunset Park Amphitheater',
        startDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 32 * 24 * 60 * 60 * 1000),
        price: '89.99',
        totalTickets: 5000,
        availableTickets: 5000,
        organizerId: demoOrganizer.id,
        isPublished: true,
        tags: ['music', 'festival', 'outdoor', 'summer'],
      },
      {
        title: 'Tech Innovation Summit 2024',
        description: 'Discover the latest trends in technology, AI, and innovation. Network with industry leaders and attend workshops on cutting-edge technologies.',
        category: insertedCategories[1].id,
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        location: 'San Francisco, CA',
        venue: 'Moscone Center',
        startDate: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 47 * 24 * 60 * 60 * 1000),
        price: '299.00',
        totalTickets: 1000,
        availableTickets: 1000,
        organizerId: demoOrganizer.id,
        isPublished: true,
        tags: ['technology', 'AI', 'networking', 'conference'],
      },
      {
        title: 'City Marathon 2024',
        description: 'Challenge yourself in our annual city marathon. Choose from full marathon, half marathon, or 5K fun run. All fitness levels welcome!',
        category: insertedCategories[2].id,
        imageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
        location: 'New York, NY',
        venue: 'Central Park',
        startDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
        price: '45.00',
        totalTickets: 10000,
        availableTickets: 10000,
        organizerId: demoOrganizer.id,
        isPublished: true,
        tags: ['sports', 'running', 'marathon', 'fitness'],
      },
      {
        title: 'Modern Art Exhibition',
        description: 'Experience contemporary art from emerging and established artists. Interactive installations, guided tours, and artist meet-and-greets.',
        category: insertedCategories[3].id,
        imageUrl: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800',
        location: 'Chicago, IL',
        venue: 'Contemporary Art Museum',
        startDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 50 * 24 * 60 * 60 * 1000),
        price: '25.00',
        totalTickets: 500,
        availableTickets: 500,
        organizerId: demoOrganizer.id,
        isPublished: true,
        tags: ['art', 'exhibition', 'culture', 'museum'],
      },
      {
        title: 'Food & Wine Festival',
        description: 'Savor culinary delights from award-winning chefs and sommeliers. Wine tastings, cooking demonstrations, and gourmet food experiences.',
        category: insertedCategories[4].id,
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
        location: 'Napa Valley, CA',
        venue: 'Vineyard Estates',
        startDate: new Date(now.getTime() + 75 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 77 * 24 * 60 * 60 * 1000),
        price: '175.00',
        totalTickets: 800,
        availableTickets: 800,
        organizerId: demoOrganizer.id,
        isPublished: true,
        tags: ['food', 'wine', 'culinary', 'tasting'],
      },
      {
        title: 'Startup Networking Mixer',
        description: 'Connect with fellow entrepreneurs, investors, and innovators. Pitch sessions, panel discussions, and valuable networking opportunities.',
        category: insertedCategories[5].id,
        imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
        location: 'Austin, TX',
        venue: 'Innovation Hub',
        startDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
        price: '0.00',
        totalTickets: 200,
        availableTickets: 200,
        organizerId: demoOrganizer.id,
        isPublished: true,
        tags: ['business', 'networking', 'startup', 'entrepreneurship'],
      },
    ];

    await db.insert(events).values(demoEvents);
    console.log('✓ Demo events seeded');

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
