import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { FACEBOOK_URL, WEEKLY_PROGRAM, programDays, programTimes } from '../lib/site-config';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create super admin user
  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@elshaddaiworld.org' },
    update: {},
    create: {
      email: 'admin@elshaddaiworld.org',
      password: hashedPassword,
      name: 'Super Admin',
      role: Role.SUPER_ADMIN,
    },
  });

  console.log('✅ Created super admin user');

  // Create sample ministries
  const ministries = [
    {
      name: 'Women of Influence',
      slug: 'women-of-influence',
      description: 'Empowering women to live purposeful lives in Christ',
      vision: 'To raise godly women who influence their communities',
      leaderName: 'Sister Grace',
      displayOnWebsite: true,
      sortOrder: 1,
    },
    {
      name: 'Men of Valour',
      slug: 'men-of-valour',
      description: 'Building strong men of God who lead with integrity',
      vision: 'To develop men who are spiritual leaders in their families and communities',
      leaderName: 'Brother John',
      displayOnWebsite: true,
      sortOrder: 2,
    },
    {
      name: 'E-Teens',
      slug: 'e-teens',
      description: 'Nurturing the next generation of believers',
      vision: 'To raise godly teenagers who impact their generation',
      leaderName: 'Pastor Youth',
      displayOnWebsite: true,
      sortOrder: 3,
    },
  ];

  for (const ministry of ministries) {
    await prisma.ministry.upsert({
      where: { slug: ministry.slug },
      update: {},
      create: ministry,
    });
  }

  console.log('✅ Created sample ministries');

  // Create sample settings
  // The programme string is generated from the single source of truth (lib/site-config.ts).
  const serviceTimes = WEEKLY_PROGRAM.map(
    (p) => `${p.name}${p.subtitle ? ` ${p.subtitle}` : ''}: ${programDays(p)}, ${programTimes(p)}`,
  ).join('; ');
  const settings = [
    { key: 'church_name', value: 'El Shaddai World Ministries', category: 'general', description: 'Church name' },
    { key: 'church_email', value: 'info@elshaddaiworld.org', category: 'general', description: 'Main church email' },
    { key: 'church_phone', value: '+27 XX XXX XXXX', category: 'general', description: 'Church phone number' },
    { key: 'church_address', value: 'Church Address Here', category: 'general', description: 'Church physical address' },
    { key: 'service_times', value: serviceTimes, category: 'general', description: 'Service times' },
    { key: 'facebook_url', value: FACEBOOK_URL, category: 'social', description: 'Facebook page URL' },
    { key: 'youtube_url', value: 'https://youtube.com/elshaddai', category: 'social', description: 'YouTube channel URL' },
    { key: 'instagram_url', value: 'https://instagram.com/elshaddai', category: 'social', description: 'Instagram URL' },
  ];

  for (const setting of settings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log('✅ Created sample settings');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📝 Super Admin Credentials:');
  console.log('   Email: admin@elshaddaiworld.org');
  console.log('   Password: Admin@123');
  console.log('\n⚠️  Please change the default password after first login!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
