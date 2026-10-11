import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Categories
  const categoryNames = ['Music', 'Workshop', 'Food', 'Sports', 'Kids'];
  const categories = [];
  
  for (const name of categoryNames) {
    const cat = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categories.push(cat);
  }
  console.log(`Created ${categories.length} categories.`);

  // 2. Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gather.com' },
    update: {},
    create: {
      email: 'admin@gather.com',
      password: adminPassword,
      name: 'Admin User',
      isAdmin: true,
    },
  });
  console.log('Created admin user: admin@gather.com / admin123');

  // 3. Create 15 Events
  // Past and future dates
  const now = new Date();
  
  const futureDate1 = new Date(now); futureDate1.setDate(now.getDate() + 5);
  const futureDate2 = new Date(now); futureDate2.setDate(now.getDate() + 14);
  const futureDate3 = new Date(now); futureDate3.setDate(now.getDate() + 30);
  const pastDate = new Date(now); pastDate.setDate(now.getDate() - 10);

  const sampleEvents = [
    {
      title: 'Symphony under the Stars',
      city: 'Mumbai',
      date: futureDate1,
      time: '6:30 PM',
      price: 1499,
      description: 'An open-air orchestral performance featuring classical masterpieces.',
      imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&q=80',
      isActive: true,
      categoryName: 'Music',
    },
    {
      title: 'Pottery Basics Workshop',
      city: 'Bangalore',
      date: futureDate1,
      time: '10:00 AM',
      price: 999,
      description: 'Learn the fundamentals of wheel throwing and hand-building techniques.',
      imageUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80',
      isActive: true,
      categoryName: 'Workshop',
    },
    {
      title: 'Artisan Coffee Tasting',
      city: 'Delhi',
      date: futureDate2,
      time: '4:00 PM',
      price: 499,
      description: 'Sample single-origin roasts from across India with expert brewers.',
      imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80',
      isActive: true,
      categoryName: 'Food',
    },
    {
      title: 'Sunday Morning Yoga',
      city: 'Pune',
      date: futureDate1,
      time: '7:00 AM',
      price: 299,
      description: 'Start your weekend with a guided vinyasa flow in the park.',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
      isActive: true,
      categoryName: 'Sports',
    },
    {
      title: 'Kids Science Fair',
      city: 'Chennai',
      date: futureDate3,
      time: '11:00 AM',
      price: 0,
      description: 'Interactive science experiments for children aged 5-12.',
      imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80',
      isActive: true,
      categoryName: 'Kids',
    },
    {
      title: 'Indie Rock Night',
      city: 'Mumbai',
      date: pastDate,
      time: '9:00 PM',
      price: 899,
      description: 'Local indie bands battle it out. (Past event)',
      imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
      isActive: true,
      categoryName: 'Music',
    },
    {
      title: 'Watercolor Landscapes',
      city: 'Hyderabad',
      date: futureDate2,
      time: '2:00 PM',
      price: 1299,
      description: 'A beginner-friendly painting session focusing on sunset landscapes.',
      imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
      isActive: false, // Inactive event
      categoryName: 'Workshop',
    },
    {
      title: 'Street Food Walk',
      city: 'Delhi',
      date: futureDate1,
      time: '5:00 PM',
      price: 799,
      description: 'A guided tour through Old Delhi tasting authentic street food.',
      imageUrl: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&q=80',
      isActive: true,
      categoryName: 'Food',
    },
    {
      title: '5K Charity Run',
      city: 'Bangalore',
      date: futureDate3,
      time: '6:00 AM',
      price: 500,
      description: 'Run for a cause. All proceeds go to local animal shelters.',
      imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80',
      isActive: true,
      categoryName: 'Sports',
    },
    {
      title: 'Storytelling Workshop for Kids',
      city: 'Pune',
      date: futureDate2,
      time: '10:30 AM',
      price: 399,
      description: 'Encouraging creativity and imagination through interactive stories.',
      imageUrl: 'https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?w=800&q=80',
      isActive: true,
      categoryName: 'Kids',
    },
    {
      title: 'Jazz & Blues Evening',
      city: 'Coimbatore',
      date: futureDate3,
      time: '8:00 PM',
      price: 1999,
      description: 'Enjoy a relaxing evening with a premium jazz quartet.',
      imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80',
      isActive: true,
      categoryName: 'Music',
    },
    {
      title: 'Vegan Cooking Masterclass',
      city: 'Chennai',
      date: futureDate1,
      time: '11:00 AM',
      price: 1599,
      description: 'Learn to prepare delicious, healthy, plant-based meals.',
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
      isActive: true,
      categoryName: 'Food',
    },
    {
      title: 'Amateur Tennis Tournament',
      city: 'Hyderabad',
      date: pastDate,
      time: '8:00 AM',
      price: 1000,
      description: 'A friendly weekend tournament for amateur players. (Past)',
      imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1f0?w=800&q=80',
      isActive: true,
      categoryName: 'Sports',
    },
    {
      title: 'DIY Plant Terrariums',
      city: 'Mumbai',
      date: futureDate3,
      time: '3:00 PM',
      price: 899,
      description: 'Build your own miniature ecosystem in a glass jar.',
      imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
      isActive: false, // Inactive event
      categoryName: 'Workshop',
    },
    {
      title: 'Puppet Show: The Magic Forest',
      city: 'Delhi',
      date: futureDate2,
      time: '4:00 PM',
      price: 250,
      description: 'A magical puppet performance bringing folktales to life.',
      imageUrl: 'https://images.unsplash.com/photo-1588825828751-24fb2f87a8b6?w=800&q=80',
      isActive: true,
      categoryName: 'Kids',
    }
  ];

  let createdEvents = 0;
  for (const eventData of sampleEvents) {
    const category = categories.find(c => c.name === eventData.categoryName);
    if (!category) continue;

    const { categoryName, ...data } = eventData;
    
    // Check if exists to avoid duplicates on re-seed
    const existing = await prisma.event.findFirst({
      where: { title: data.title, city: data.city }
    });

    if (!existing) {
      await prisma.event.create({
        data: {
          ...data,
          categoryId: category.id,
        },
      });
      createdEvents++;
    }
  }
  
  console.log(`Created ${createdEvents} events.`);
  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
