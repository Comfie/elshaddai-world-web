# El Shaddai Church Management System - Complete Development Plan

## Project Overview

A modern, full-stack church management system with a public-facing website and admin portal for El Shaddai World Ministries. The system will replace the outdated website at https://www.elshaddaiworld.org/ with a responsive, feature-rich platform.

## Tech Stack

- **Framework**: Next.js 14/15 (App Router with TypeScript)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **UI Components**: shadcn/ui + Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Context API (keep simple)
- **File Upload**: Uploadthing or Cloudinary
- **Payment Integration**: Paystack (South African market)
- **Email**: Resend or SendGrid
- **Deployment**: Vercel
- **Version Control**: Git

## Project Structure

```
church-management/
├── app/
│   ├── (public)/                  # Public-facing website
│   │   ├── page.tsx              # Homepage
│   │   ├── about/
│   │   ├── ministries/
│   │   │   ├── page.tsx          # Ministries overview
│   │   │   ├── women-of-influence/
│   │   │   ├── men-of-valour/
│   │   │   ├── e-teens/
│   │   │   └── [ministry]/       # Dynamic ministry pages
│   │   ├── events/
│   │   ├── sermons/
│   │   ├── books/                # Pastor's books showcase
│   │   ├── contact/
│   │   ├── give/
│   │   └── new-here/             # First-time visitors
│   ├── (admin)/                   # Admin portal (protected)
│   │   ├── dashboard/
│   │   ├── members/
│   │   ├── follow-ups/
│   │   ├── notices/
│   │   ├── events/
│   │   ├── ministries/
│   │   ├── groups/
│   │   ├── attendance/
│   │   ├── books/
│   │   ├── communications/
│   │   ├── reports/
│   │   └── settings/
│   ├── api/
│   │   ├── auth/
│   │   ├── members/
│   │   ├── follow-ups/
│   │   ├── notices/
│   │   ├── events/
│   │   ├── ministries/
│   │   ├── books/
│   │   └── upload/
│   └── layout.tsx
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── public/                    # Public website components
│   └── admin/                     # Admin portal components
├── lib/
│   ├── db.ts                      # Prisma client
│   ├── auth.ts                    # NextAuth config
│   └── utils.ts
├── prisma/
│   └── schema.prisma
└── public/
```

## Database Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============== USER MANAGEMENT ==============

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  password      String   // Hashed with bcrypt
  name          String
  role          Role     @default(MEMBER)
  isActive      Boolean  @default(true)
  lastLogin     DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  createdNotices Notice[] @relation("NoticeCreator")
  createdEvents  Event[]  @relation("EventCreator")
  assignedFollowUps FollowUp[] @relation("AssignedFollowUps")
}

enum Role {
  SUPER_ADMIN  // Pastor - full access
  ADMIN        // Church leaders - most access
  LEADER       // Ministry leaders - limited access
  MEMBER       // Regular members - view only
}

// ============== MEMBER MANAGEMENT ==============

model Member {
  id              String    @id @default(cuid())
  firstName       String
  lastName        String
  email           String?   @unique
  phone           String
  alternatePhone  String?
  address         String?
  city            String?
  province        String?
  postalCode      String?
  dateOfBirth     DateTime?
  gender          Gender?
  maritalStatus   MaritalStatus?
  photoUrl        String?
  
  // Church-specific
  membershipType  MembershipType @default(VISITOR)
  joinDate        DateTime  @default(now())
  baptized        Boolean   @default(false)
  baptismDate     DateTime?
  salvationDate   DateTime?
  
  // Ministry & Groups
  ministryId      String?
  ministry        Ministry? @relation(fields: [ministryId], references: [id])
  groupId         String?
  group           Group?    @relation(fields: [groupId], references: [id])
  
  // Family
  familyId        String?
  family          Family?   @relation(fields: [familyId], references: [id])
  
  // Status
  status          MemberStatus @default(ACTIVE)
  notes           String?   @db.Text
  
  // Metadata
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  followUps       FollowUp[]
  attendance      Attendance[]
  pledges         Pledge[]
}

enum Gender {
  MALE
  FEMALE
  OTHER
}

enum MaritalStatus {
  SINGLE
  MARRIED
  DIVORCED
  WIDOWED
}

enum MembershipType {
  VISITOR
  NEW_CONVERT
  MEMBER
  LEADER
  PASTOR
}

enum MemberStatus {
  ACTIVE
  INACTIVE
  TRANSFERRED
  DECEASED
}

// ============== FAMILY MANAGEMENT ==============

model Family {
  id              String   @id @default(cuid())
  familyName      String
  headOfHousehold String?
  address         String?
  city            String?
  province        String?
  postalCode      String?
  homePhone       String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  members         Member[]
}

// ============== MINISTRIES ==============

model Ministry {
  id              String   @id @default(cuid())
  name            String   @unique
  slug            String   @unique
  description     String?  @db.Text
  vision          String?  @db.Text
  mission         String?  @db.Text
  
  // Leadership
  leaderId        String?
  leaderName      String?
  leaderEmail     String?
  leaderPhone     String?
  
  // Media
  imageUrl        String?
  bannerUrl       String?
  
  // Schedule
  meetingDay      String?
  meetingTime     String?
  meetingLocation String?
  
  // Status
  isActive        Boolean  @default(true)
  displayOnWebsite Boolean @default(true)
  sortOrder       Int      @default(0)
  
  // Metadata
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  members         Member[]
  events          Event[]
  groups          Group[]
}

// ============== GROUPS (Small Groups, Bible Study, etc.) ==============

model Group {
  id              String   @id @default(cuid())
  name            String
  description     String?  @db.Text
  
  // Leadership
  leaderId        String?
  leaderName      String?
  
  // Ministry connection
  ministryId      String?
  ministry        Ministry? @relation(fields: [ministryId], references: [id])
  
  // Schedule
  meetingDay      String?
  meetingTime     String?
  meetingLocation String?
  
  // Limits
  maxMembers      Int?
  
  // Status
  isActive        Boolean  @default(true)
  
  // Metadata
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  members         Member[]
  events          Event[]
}

// ============== FOLLOW-UPS ==============

model FollowUp {
  id              String   @id @default(cuid())
  
  // Member being followed up
  memberId        String
  member          Member   @relation(fields: [memberId], references: [id], onDelete: Cascade)
  
  // Assignment
  assignedToId    String
  assignedTo      User     @relation("AssignedFollowUps", fields: [assignedToId], references: [id])
  assignedToName  String
  
  // Follow-up details
  reason          FollowUpReason
  reasonOther     String?
  priority        Priority @default(NORMAL)
  method          ContactMethod?
  
  // Status tracking
  status          FollowUpStatus @default(PENDING)
  dueDate         DateTime
  completedAt     DateTime?
  
  // Notes
  initialNotes    String?  @db.Text
  followUpNotes   String?  @db.Text
  outcome         String?  @db.Text
  
  // Next steps
  requiresFollowUp Boolean @default(false)
  nextFollowUpDate DateTime?
  
  // Metadata
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum FollowUpReason {
  NEW_VISITOR
  NEW_CONVERT
  ABSENT
  SICK
  PRAYER_REQUEST
  COUNSELING
  MEMBERSHIP
  BAPTISM
  OTHER
}

enum ContactMethod {
  PHONE_CALL
  TEXT_MESSAGE
  WHATSAPP
  EMAIL
  HOME_VISIT
  CHURCH_VISIT
}

enum FollowUpStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  CANCELLED
  NO_RESPONSE
}

enum Priority {
  LOW
  NORMAL
  HIGH
  URGENT
}

// ============== NOTICES/ANNOUNCEMENTS ==============

model Notice {
  id              String   @id @default(cuid())
  title           String
  content         String   @db.Text
  summary         String?  // Short summary for homepage
  
  // Display settings
  priority        Priority @default(NORMAL)
  category        NoticeCategory @default(GENERAL)
  
  // Targeting
  displayOnWebsite Boolean @default(true)
  displayInAdmin   Boolean @default(true)
  targetAudience   TargetAudience @default(EVERYONE)
  
  // Scheduling
  publishDate     DateTime @default(now())
  expiryDate      DateTime?
  isActive        Boolean  @default(true)
  
  // Media
  imageUrl        String?
  attachmentUrl   String?
  
  // Author
  createdById     String
  createdBy       User     @relation("NoticeCreator", fields: [createdById], references: [id])
  createdByName   String
  
  // Metadata
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([publishDate, expiryDate, isActive])
}

enum NoticeCategory {
  GENERAL
  URGENT
  EVENT
  PRAYER
  MINISTRY
  YOUTH
  ADMINISTRATIVE
}

enum TargetAudience {
  EVERYONE
  MEMBERS_ONLY
  LEADERS_ONLY
  SPECIFIC_MINISTRY
}

// ============== EVENTS ==============

model Event {
  id              String   @id @default(cuid())
  title           String
  description     String?  @db.Text
  
  // Scheduling
  eventDate       DateTime
  endDate         DateTime?
  startTime       String?
  endTime         String?
  isAllDay        Boolean  @default(false)
  isRecurring     Boolean  @default(false)
  recurrenceRule  String?  // RRULE format
  
  // Location
  location        String
  address         String?
  isOnline        Boolean  @default(false)
  onlineLink      String?
  
  // Categorization
  eventType       EventType @default(SERVICE)
  ministryId      String?
  ministry        Ministry? @relation(fields: [ministryId], references: [id])
  groupId         String?
  group           Group?    @relation(fields: [groupId], references: [id])
  
  // Registration
  requiresRSVP    Boolean  @default(false)
  maxAttendees    Int?
  registrationDeadline DateTime?
  
  // Media
  imageUrl        String?
  posterUrl       String?
  
  // Display
  displayOnWebsite Boolean @default(true)
  isFeatured      Boolean  @default(false)
  
  // Status
  status          EventStatus @default(SCHEDULED)
  
  // Author
  createdById     String
  createdBy       User     @relation("EventCreator", fields: [createdById], references: [id])
  
  // Metadata
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  attendance      Attendance[]
  
  @@index([eventDate, status])
}

enum EventType {
  SERVICE
  PRAYER_MEETING
  BIBLE_STUDY
  CONFERENCE
  SEMINAR
  WORKSHOP
  OUTREACH
  SOCIAL
  FUNDRAISER
  BAPTISM
  WEDDING
  FUNERAL
  OTHER
}

enum EventStatus {
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  POSTPONED
}

// ============== ATTENDANCE ==============

model Attendance {
  id              String   @id @default(cuid())
  
  // Who attended
  memberId        String
  member          Member   @relation(fields: [memberId], references: [id], onDelete: Cascade)
  
  // What they attended
  eventId         String?
  event           Event?   @relation(fields: [eventId], references: [id], onDelete: Cascade)
  serviceDate     DateTime
  serviceType     ServiceType @default(SUNDAY_SERVICE)
  
  // Attendance details
  present         Boolean  @default(true)
  checkInTime     DateTime?
  notes           String?
  
  // Metadata
  createdAt       DateTime @default(now())
  
  @@unique([memberId, serviceDate, serviceType])
  @@index([serviceDate, present])
}

enum ServiceType {
  SUNDAY_SERVICE
  MIDWEEK_SERVICE
  PRAYER_MEETING
  BIBLE_STUDY
  SPECIAL_EVENT
  OTHER
}

// ============== BOOKS (Pastor's Publications) ==============

model Book {
  id              String   @id @default(cuid())
  title           String
  subtitle        String?
  author          String   @default("Apostle Charles Magaiza")
  
  // Description
  description     String   @db.Text
  shortDescription String?
  
  // Publishing info
  isbn            String?
  publisher       String?
  publishedDate   DateTime?
  edition         String?
  pageCount       Int?
  language        String   @default("English")
  
  // Pricing
  price           Decimal? @db.Decimal(10, 2)
  currency        String   @default("ZAR")
  
  // Purchase
  amazonUrl       String   // Primary purchase link
  otherPurchaseUrls Json?  // Array of {platform: string, url: string}
  
  // Media
  coverImageUrl   String
  samplePdfUrl    String?  // Preview/sample chapter
  
  // Categorization
  category        BookCategory @default(CHRISTIAN_LIVING)
  tags            String[]
  
  // Display
  isFeatured      Boolean  @default(false)
  displayOrder    Int      @default(0)
  isAvailable     Boolean  @default(true)
  
  // Metadata
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([isFeatured, displayOrder])
}

enum BookCategory {
  CHRISTIAN_LIVING
  THEOLOGY
  DEVOTIONAL
  PRAYER
  FAITH
  MINISTRY
  LEADERSHIP
  FAMILY
  YOUTH
  OTHER
}

// ============== SERMONS ==============

model Sermon {
  id              String   @id @default(cuid())
  title           String
  description     String?  @db.Text
  
  // Sermon details
  preacher        String   @default("Apostle Charles Magaiza")
  sermonDate      DateTime
  series          String?
  topic           String?
  scripture       String?  // E.g., "John 3:16-18"
  
  // Media
  videoUrl        String?  // YouTube, Vimeo, etc.
  audioUrl        String?
  notesUrl        String?  // PDF of sermon notes
  thumbnailUrl    String?
  
  // Categorization
  tags            String[]
  category        SermonCategory @default(SUNDAY_SERVICE)
  
  // Stats
  views           Int      @default(0)
  downloads       Int      @default(0)
  
  // Display
  isFeatured      Boolean  @default(false)
  
  // Metadata
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([sermonDate, isFeatured])
}

enum SermonCategory {
  SUNDAY_SERVICE
  MIDWEEK_SERVICE
  SPECIAL_EVENT
  CONFERENCE
  SERIES
  GUEST_SPEAKER
}

// ============== GIVING/PLEDGES ==============

model Pledge {
  id              String   @id @default(cuid())
  
  // Who pledged
  memberId        String
  member          Member   @relation(fields: [memberId], references: [id], onDelete: Cascade)
  
  // Pledge details
  pledgeType      PledgeType
  amount          Decimal  @db.Decimal(10, 2)
  currency        String   @default("ZAR")
  frequency       PledgeFrequency @default(ONE_TIME)
  
  // Dates
  pledgeDate      DateTime @default(now())
  startDate       DateTime
  endDate         DateTime?
  
  // Tracking
  amountPaid      Decimal  @db.Decimal(10, 2) @default(0)
  status          PledgeStatus @default(ACTIVE)
  
  // Notes
  notes           String?  @db.Text
  
  // Metadata
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum PledgeType {
  TITHE
  OFFERING
  BUILDING_FUND
  MISSIONS
  SPECIAL_PROJECT
  OTHER
}

enum PledgeFrequency {
  ONE_TIME
  WEEKLY
  MONTHLY
  QUARTERLY
  YEARLY
}

enum PledgeStatus {
  ACTIVE
  COMPLETED
  CANCELLED
}

// ============== PRAYER REQUESTS ==============

model PrayerRequest {
  id              String   @id @default(cuid())
  
  // Requester info (can be anonymous)
  name            String?
  email           String?
  phone           String?
  isAnonymous     Boolean  @default(false)
  
  // Prayer request
  category        PrayerCategory @default(GENERAL)
  request         String   @db.Text
  isUrgent        Boolean  @default(false)
  
  // Privacy
  isPublic        Boolean  @default(false)
  shareWithPastors Boolean @default(true)
  shareWithLeaders Boolean @default(false)
  
  // Status
  status          PrayerStatus @default(SUBMITTED)
  prayedBy        String[]     // Array of user IDs who prayed
  prayerCount     Int      @default(0)
  
  // Testimony
  hasTestimony    Boolean  @default(false)
  testimony       String?  @db.Text
  testimonyDate   DateTime?
  
  // Metadata
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([status, isUrgent, category])
}

enum PrayerCategory {
  GENERAL
  HEALTH
  FAMILY
  FINANCIAL
  EMPLOYMENT
  SPIRITUAL
  SALVATION
  DIRECTION
  OTHER
}

enum PrayerStatus {
  SUBMITTED
  PRAYING
  ANSWERED
  CLOSED
}

// ============== CONTACT FORMS ==============

model ContactMessage {
  id              String   @id @default(cuid())
  name            String
  email           String
  phone           String?
  subject         String
  message         String   @db.Text
  
  // Categorization
  category        ContactCategory @default(GENERAL)
  
  // Status
  status          MessageStatus @default(NEW)
  assignedTo      String?
  response        String?  @db.Text
  respondedAt     DateTime?
  
  // Metadata
  ipAddress       String?
  userAgent       String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([status, category])
}

enum ContactCategory {
  GENERAL
  PRAYER_REQUEST
  VISITOR_INFO
  PARTNERSHIP
  MEDIA_INQUIRY
  COMPLAINT
  SUGGESTION
}

enum MessageStatus {
  NEW
  IN_PROGRESS
  RESPONDED
  CLOSED
}

// ============== SETTINGS ==============

model Settings {
  id              String   @id @default(cuid())
  key             String   @unique
  value           String   @db.Text
  category        String
  description     String?
  updatedAt       DateTime @updatedAt
}
```

## Implementation Phases

### Phase 1: Project Setup (Day 1-2)

**Tasks:**
1. Initialize Next.js project with TypeScript
2. Setup Prisma with PostgreSQL
3. Configure NextAuth.js
4. Install and configure shadcn/ui
5. Setup Tailwind CSS
6. Configure environment variables
7. Create basic project structure

**Commands:**
```bash
# Create Next.js app
npx create-next-app@latest church-management --typescript --tailwind --app --use-npm

cd church-management

# Install dependencies
npm install @prisma/client prisma
npm install next-auth @auth/prisma-adapter
npm install react-hook-form @hookform/resolvers zod
npm install date-fns
npm install lucide-react
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-tabs
npm install uploadthing @uploadthing/react
npm install recharts  # For charts/reports
npm install react-big-calendar  # For event calendar
npm install bcryptjs
npm install @types/bcryptjs -D

# Initialize Prisma
npx prisma init

# Initialize shadcn/ui
npx shadcn-ui@latest init
```

**shadcn/ui components to install:**
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add table
npx shadcn-ui@latest add form
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add pagination
```

**Environment Variables (.env):**
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/church_db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Uploadthing (for file uploads)
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Email (Resend or SendGrid)
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="noreply@elshaddaiworld.org"

# Payment (Paystack)
PAYSTACK_SECRET_KEY="your-paystack-secret"
PAYSTACK_PUBLIC_KEY="your-paystack-public-key"

# Optional: SMS (Africa's Talking or similar)
AFRICAS_TALKING_API_KEY="your-api-key"
AFRICAS_TALKING_USERNAME="your-username"
```

### Phase 2: Database & Authentication (Day 3-4)

**Tasks:**
1. Copy the complete Prisma schema above
2. Run migrations
3. Create seed data
4. Setup NextAuth.js with credentials provider
5. Create login page
6. Create middleware for route protection
7. Create initial super admin user

**Implementation:**

**prisma/seed.ts:**
```typescript
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
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

  // Create sample settings
  const settings = [
    { key: 'church_name', value: 'El Shaddai World Ministries', category: 'general', description: 'Church name' },
    { key: 'church_email', value: 'info@elshaddaiworld.org', category: 'general', description: 'Main church email' },
    { key: 'church_phone', value: '+27 XX XXX XXXX', category: 'general', description: 'Church phone number' },
    { key: 'church_address', value: 'Church Address Here', category: 'general', description: 'Church physical address' },
    { key: 'service_times', value: 'Sunday 9:00 AM & 11:00 AM', category: 'general', description: 'Service times' },
    { key: 'facebook_url', value: 'https://facebook.com/elshaddai', category: 'social', description: 'Facebook page URL' },
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

  console.log('Database seeded successfully!');
  console.log('Super Admin Credentials:');
  console.log('Email: admin@elshaddaiworld.org');
  console.log('Password: Admin@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Run migrations:**
```bash
npx prisma migrate dev --name init
npx prisma generate
npm run seed
```

### Phase 3: Admin Portal - Dashboard (Day 5-7)

**Features:**
- Dashboard layout with sidebar navigation
- Statistics cards (total members, pending follow-ups, upcoming events, active notices)
- Recent activity feed
- Quick action buttons
- Charts (member growth, attendance trends)

**Pages to create:**
- `/app/(admin)/dashboard/page.tsx`
- `/app/(admin)/layout.tsx` - Sidebar and top navigation
- `/components/admin/dashboard/stats-card.tsx`
- `/components/admin/dashboard/activity-feed.tsx`
- `/components/admin/dashboard/charts.tsx`

**API Routes:**
- `/app/api/dashboard/stats/route.ts` - Get dashboard statistics
- `/app/api/dashboard/activity/route.ts` - Get recent activity

### Phase 4: Members Management (Day 8-10)

**Features:**
- Members list with search, filter, pagination
- Add new member form with photo upload
- Edit member details
- View member profile (full details, attendance history, follow-ups)
- Delete/archive member
- Export members to Excel/CSV
- Bulk actions (send SMS/email, assign to ministry)

**Pages to create:**
- `/app/(admin)/members/page.tsx` - Members list
- `/app/(admin)/members/new/page.tsx` - Add new member
- `/app/(admin)/members/[id]/page.tsx` - View member details
- `/app/(admin)/members/[id]/edit/page.tsx` - Edit member

**Components:**
- `/components/admin/members/member-list.tsx`
- `/components/admin/members/member-form.tsx`
- `/components/admin/members/member-card.tsx`
- `/components/admin/members/member-filters.tsx`

**API Routes:**
- `/app/api/members/route.ts` - GET (list), POST (create)
- `/app/api/members/[id]/route.ts` - GET (single), PUT (update), DELETE
- `/app/api/members/search/route.ts` - Search members
- `/app/api/members/export/route.ts` - Export to Excel/CSV

### Phase 5: Follow-ups System (Day 11-13)

**Features:**
- Follow-ups dashboard (pending, in progress, completed)
- Create new follow-up task
- Assign follow-up to leaders
- Update follow-up status and notes
- Mark as completed with outcome
- Follow-up reminders (email/SMS notifications)
- Filter by status, priority, assigned to
- Calendar view of follow-up due dates

**Pages to create:**
- `/app/(admin)/follow-ups/page.tsx` - Follow-ups list
- `/app/(admin)/follow-ups/new/page.tsx` - Create follow-up
- `/app/(admin)/follow-ups/[id]/page.tsx` - Follow-up details

**Components:**
- `/components/admin/follow-ups/follow-up-list.tsx`
- `/components/admin/follow-ups/follow-up-form.tsx`
- `/components/admin/follow-ups/follow-up-card.tsx`
- `/components/admin/follow-ups/follow-up-calendar.tsx`

**API Routes:**
- `/app/api/follow-ups/route.ts` - GET (list), POST (create)
- `/app/api/follow-ups/[id]/route.ts` - GET, PUT, DELETE
- `/app/api/follow-ups/stats/route.ts` - Get follow-up statistics

### Phase 6: Notices/Announcements (Day 14-15)

**Features:**
- Notices list (active, scheduled, expired)
- Create notice with rich text editor
- Schedule publish/expiry dates
- Set priority (urgent, normal)
- Category selection
- Target audience (everyone, members only, leaders only)
- Image upload
- Preview before publishing
- Edit/delete notices

**Pages to create:**
- `/app/(admin)/notices/page.tsx` - Notices list
- `/app/(admin)/notices/new/page.tsx` - Create notice
- `/app/(admin)/notices/[id]/edit/page.tsx` - Edit notice

**Components:**
- `/components/admin/notices/notice-list.tsx`
- `/components/admin/notices/notice-form.tsx`
- `/components/admin/notices/notice-card.tsx`
- `/components/admin/notices/rich-text-editor.tsx`

**API Routes:**
- `/app/api/notices/route.ts` - GET (list), POST (create)
- `/app/api/notices/[id]/route.ts` - GET, PUT, DELETE
- `/app/api/notices/active/route.ts` - Get active notices

### Phase 7: Events Management (Day 16-18)

**Features:**
- Events calendar view (month, week, day)
- Events list view with filters
- Create event with all details
- Recurring events support
- RSVP management
- Event categories
- Ministry/group assignment
- Image/poster upload
- Attendance tracking integration
- Export attendees list

**Pages to create:**
- `/app/(admin)/events/page.tsx` - Events calendar/list
- `/app/(admin)/events/new/page.tsx` - Create event
- `/app/(admin)/events/[id]/page.tsx` - Event details
- `/app/(admin)/events/[id]/edit/page.tsx` - Edit event
- `/app/(admin)/events/[id]/attendees/page.tsx` - Manage attendees

**Components:**
- `/components/admin/events/event-calendar.tsx`
- `/components/admin/events/event-list.tsx`
- `/components/admin/events/event-form.tsx`
- `/components/admin/events/event-card.tsx`

**API Routes:**
- `/app/api/events/route.ts` - GET (list), POST (create)
- `/app/api/events/[id]/route.ts` - GET, PUT, DELETE
- `/app/api/events/upcoming/route.ts` - Get upcoming events
- `/app/api/events/[id]/rsvp/route.ts` - RSVP management

### Phase 8: Ministries Management (Day 19-20)

**Features:**
- Ministries list
- Create/edit ministry
- Assign leader
- Add ministry description, vision, mission
- Upload ministry images/banners
- Manage ministry members
- View ministry statistics
- Toggle display on website

**Pages to create:**
- `/app/(admin)/ministries/page.tsx` - Ministries list
- `/app/(admin)/ministries/new/page.tsx` - Create ministry
- `/app/(admin)/ministries/[id]/page.tsx` - Ministry details
- `/app/(admin)/ministries/[id]/edit/page.tsx` - Edit ministry
- `/app/(admin)/ministries/[id]/members/page.tsx` - Ministry members

**API Routes:**
- `/app/api/ministries/route.ts` - GET (list), POST (create)
- `/app/api/ministries/[id]/route.ts` - GET, PUT, DELETE
- `/app/api/ministries/[id]/members/route.ts` - Get ministry members
- `/app/api/ministries/[id]/stats/route.ts` - Ministry statistics

### Phase 9: Books Management (Day 21-22)

**Features:**
- Books list (admin view)
- Add new book with all details
- Upload book cover image
- Add Amazon purchase link
- Add sample PDF (optional)
- Edit/delete books
- Set featured books
- Reorder books (display order)
- Toggle availability

**Pages to create:**
- `/app/(admin)/books/page.tsx` - Books list (admin)
- `/app/(admin)/books/new/page.tsx` - Add new book
- `/app/(admin)/books/[id]/edit/page.tsx` - Edit book

**API Routes:**
- `/app/api/books/route.ts` - GET (list), POST (create)
- `/app/api/books/[id]/route.ts` - GET, PUT, DELETE

### Phase 10: Attendance Tracking (Day 23-24)

**Features:**
- Quick attendance marking (check-in)
- Service date and type selection
- Bulk mark attendance
- View attendance by date
- Member attendance history
- Attendance reports (weekly, monthly, yearly)
- Attendance statistics

**Pages to create:**
- `/app/(admin)/attendance/page.tsx` - Attendance dashboard
- `/app/(admin)/attendance/mark/page.tsx` - Mark attendance
- `/app/(admin)/attendance/history/page.tsx` - Attendance history
- `/app/(admin)/attendance/reports/page.tsx` - Attendance reports

**API Routes:**
- `/app/api/attendance/route.ts` - GET (list), POST (mark attendance)
- `/app/api/attendance/bulk/route.ts` - Bulk mark attendance
- `/app/api/attendance/reports/route.ts` - Generate reports

### Phase 11: Communications (Day 25-26)

**Features:**
- Send bulk SMS (via SMS API)
- Send bulk emails
- Filter recipients (by ministry, group, membership type)
- Message templates
- Scheduled messages
- Message history
- Delivery status tracking

**Pages to create:**
- `/app/(admin)/communications/page.tsx` - Communications dashboard
- `/app/(admin)/communications/sms/page.tsx` - Send SMS
- `/app/(admin)/communications/email/page.tsx` - Send email
- `/app/(admin)/communications/history/page.tsx` - Message history

**API Routes:**
- `/app/api/communications/sms/route.ts` - Send SMS
- `/app/api/communications/email/route.ts` - Send email
- `/app/api/communications/history/route.ts` - Message history

### Phase 12: Reports (Day 27-28)

**Features:**
- Member growth report (chart and table)
- Attendance reports (trends, averages)
- Follow-up completion rates
- Ministry reports (members per ministry)
- Age/gender distribution
- Baptism reports
- Export all reports to Excel/PDF

**Pages to create:**
- `/app/(admin)/reports/page.tsx` - Reports dashboard
- `/app/(admin)/reports/members/page.tsx` - Member reports
- `/app/(admin)/reports/attendance/page.tsx` - Attendance reports
- `/app/(admin)/reports/follow-ups/page.tsx` - Follow-up reports
- `/app/(admin)/reports/ministries/page.tsx` - Ministry reports

**API Routes:**
- `/app/api/reports/members/route.ts`
- `/app/api/reports/attendance/route.ts`
- `/app/api/reports/follow-ups/route.ts`
- `/app/api/reports/ministries/route.ts`

### Phase 13: Settings (Day 29)

**Features:**
- Church information settings
- Service times
- Social media links
- Email templates
- SMS settings
- Payment settings (Paystack)
- User management (add/edit/delete users)
- Role permissions

**Pages to create:**
- `/app/(admin)/settings/page.tsx` - Settings tabs
- `/app/(admin)/settings/general/page.tsx` - General settings
- `/app/(admin)/settings/users/page.tsx` - User management
- `/app/(admin)/settings/integrations/page.tsx` - API integrations

**API Routes:**
- `/app/api/settings/route.ts` - GET, PUT
- `/app/api/users/route.ts` - User management

---

## PUBLIC WEBSITE IMPLEMENTATION

### Phase 14: Homepage (Day 30-31)

**Features:**
- Hero section with church name and tagline
- Live service embed (YouTube live)
- Latest announcements (from admin notices)
- Upcoming events (next 3-5 events)
- Ministries overview (cards linking to ministry pages)
- Featured books section
- Latest sermon
- Quick stats (members, years of ministry)
- Footer with contact info and social links

**Pages to create:**
- `/app/(public)/page.tsx` - Homepage
- `/components/public/hero.tsx`
- `/components/public/announcements-section.tsx`
- `/components/public/events-section.tsx`
- `/components/public/ministries-section.tsx`
- `/components/public/books-section.tsx`
- `/components/public/sermon-section.tsx`
- `/components/public/footer.tsx`

**API Routes:**
- `/app/api/public/notices/route.ts` - Get active notices for homepage
- `/app/api/public/events/upcoming/route.ts` - Get upcoming events

### Phase 15: About Page (Day 32)

**Features:**
- Church history
- Mission and vision
- Statement of faith
- Leadership team (Pastor and key leaders)
- Church values
- Photos/gallery

**Pages to create:**
- `/app/(public)/about/page.tsx`
- `/app/(public)/about/leadership/page.tsx`
- `/app/(public)/about/beliefs/page.tsx`

### Phase 16: Ministries Pages (Day 33-34)

**Features:**
- Ministries overview page (list all ministries)
- Individual ministry pages (dynamic routes)
- Ministry description, vision, mission
- Leader information
- Meeting times and location
- Ministry events
- Photo gallery
- Contact form for ministry inquiries

**Pages to create:**
- `/app/(public)/ministries/page.tsx` - All ministries
- `/app/(public)/ministries/[slug]/page.tsx` - Individual ministry page
- `/app/(public)/ministries/women-of-influence/page.tsx` (optional static)
- `/app/(public)/ministries/men-of-valour/page.tsx` (optional static)
- `/app/(public)/ministries/e-teens/page.tsx` (optional static)

**API Routes:**
- `/app/api/public/ministries/route.ts` - Get all active ministries
- `/app/api/public/ministries/[slug]/route.ts` - Get single ministry

### Phase 17: Events Page (Day 35)

**Features:**
- Events calendar view
- Events list view with filters
- Event details modal/page
- RSVP form (if enabled)
- Past events archive
- Add to calendar button (Google Calendar, iCal)

**Pages to create:**
- `/app/(public)/events/page.tsx` - Events calendar/list
- `/app/(public)/events/[id]/page.tsx` - Event details

**API Routes:**
- `/app/api/public/events/route.ts` - Get public events

### Phase 18: Sermons Page (Day 36)

**Features:**
- Latest sermons grid
- Search by title, topic, scripture
- Filter by series, category, date
- Sermon player (video/audio)
- Download sermon audio
- View sermon notes (PDF)
- Share buttons

**Pages to create:**
- `/app/(public)/sermons/page.tsx` - Sermons archive
- `/app/(public)/sermons/[id]/page.tsx` - Single sermon page

**API Routes:**
- `/app/api/public/sermons/route.ts` - Get sermons
- `/app/api/public/sermons/[id]/route.ts` - Get single sermon

### Phase 19: Books Page (Day 37)

**Features:**
- Books showcase (grid layout)
- Featured books section
- Book details (description, author, pricing)
- "Buy on Amazon" button (opens Amazon link)
- Book cover images
- Filter by category
- Sample chapter download (if available)

**Pages to create:**
- `/app/(public)/books/page.tsx` - All books
- `/app/(public)/books/[id]/page.tsx` - Book details

**Components:**
- `/components/public/books/book-grid.tsx`
- `/components/public/books/book-card.tsx`
- `/components/public/books/book-details.tsx`

**API Routes:**
- `/app/api/public/books/route.ts` - Get available books
- `/app/api/public/books/[id]/route.ts` - Get single book

### Phase 20: Give Online Page (Day 38)

**Features:**
- Giving options (tithe, offering, building fund, missions)
- Payment integration (Paystack for South Africa)
- One-time or recurring giving
- Secure payment form
- Payment confirmation
- Receipt via email
- Giving impact stories (optional)

**Pages to create:**
- `/app/(public)/give/page.tsx` - Giving page
- `/app/(public)/give/success/page.tsx` - Payment success
- `/app/(public)/give/cancel/page.tsx` - Payment cancelled

**API Routes:**
- `/app/api/payments/initialize/route.ts` - Initialize payment
- `/app/api/payments/verify/route.ts` - Verify payment
- `/app/api/payments/webhook/route.ts` - Paystack webhook

### Phase 21: Contact & New Here Pages (Day 39)

**Features:**

**Contact Page:**
- Contact form (name, email, phone, message)
- Church location map (Google Maps embed)
- Service times
- Contact information (phone, email, address)
- Social media links

**New Here (First-Time Visitors):**
- Welcome message/video from pastor
- What to expect at service
- Directions and parking info
- "I'm New" form (visitor information)
- FAQ for first-time visitors

**Pages to create:**
- `/app/(public)/contact/page.tsx`
- `/app/(public)/new-here/page.tsx`

**API Routes:**
- `/app/api/contact/route.ts` - Submit contact form
- `/app/api/visitors/route.ts` - Submit visitor form

### Phase 22: Prayer Requests Page (Day 40)

**Features:**
- Prayer request form
- Option for anonymous submission
- Prayer categories
- Public prayer wall (if allowed)
- Testimonies section (answered prayers)

**Pages to create:**
- `/app/(public)/prayer/page.tsx` - Prayer request form
- `/app/(public)/prayer/testimonies/page.tsx` - Answered prayers

**API Routes:**
- `/app/api/prayer/route.ts` - Submit prayer request
- `/app/api/prayer/public/route.ts` - Get public prayer requests

### Phase 23: Mobile Responsiveness & SEO (Day 41-42)

**Tasks:**
- Ensure all pages are mobile-responsive
- Add proper meta tags for SEO
- Create sitemap.xml
- Add robots.txt
- Optimize images (Next.js Image component)
- Add structured data (JSON-LD) for church, events
- Add Open Graph tags for social sharing
- Test on various devices and browsers

**Files to create:**
- `/app/sitemap.ts` - Dynamic sitemap
- `/app/robots.ts` - Robots.txt
- `/app/layout.tsx` - Global SEO metadata

### Phase 24: Testing & Bug Fixes (Day 43-45)

**Tasks:**
- Test all admin portal features
- Test all public website features
- Test authentication and authorization
- Test forms and validations
- Test file uploads
- Test email/SMS sending
- Test payment integration
- Fix any bugs found
- Optimize database queries
- Add error handling
- Add loading states
- Improve user feedback (toasts, alerts)

### Phase 25: Deployment & Launch (Day 46-47)

**Tasks:**
1. Setup production database (Supabase, Railway, or similar)
2. Configure production environment variables
3. Setup domain name
4. Deploy to Vercel
5. Configure custom domain
6. Setup SSL certificate
7. Test production site
8. Create admin user guide documentation
9. Create backup/restore procedures
10. Monitor for errors (Sentry or similar)

**Deployment Commands:**
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Run database migrations on production
npx prisma migrate deploy
npx prisma generate
```

### Phase 26: Admin Training & Handover (Day 48-49)

**Tasks:**
- Train pastors/leaders on admin portal
- Create video tutorials for common tasks
- Document all features
- Create user manual (PDF)
- Setup support system
- Plan for ongoing maintenance

**Training Topics:**
1. Login and navigation
2. Managing members
3. Creating and managing follow-ups
4. Creating announcements and events
5. Managing ministries
6. Tracking attendance
7. Sending communications
8. Viewing reports
9. Managing books
10. Website content updates

### Phase 27: Post-Launch Improvements (Day 50+)

**Future Features to Consider:**
- Member portal (members can login and update their info)
- Mobile app (React Native or Flutter)
- WhatsApp integration for notifications
- SMS reminders for events
- Online small group registration
- Volunteer management
- Children's check-in system
- Streaming integration (for live services)
- Podcast feed for sermons
- Multi-language support
- Push notifications
- Advanced analytics
- Integration with accounting software

---

## Key Implementation Guidelines

### Code Quality Standards

1. **TypeScript**: Use strict mode, proper types, no `any`
2. **Components**: Keep components small and focused
3. **API Routes**: Proper error handling, validation with Zod
4. **Database**: Use transactions for related operations
5. **Security**: Validate all inputs, sanitize data, protect routes
6. **Performance**: Use Next.js caching, optimize images, lazy load
7. **Accessibility**: Proper ARIA labels, keyboard navigation
8. **Testing**: Write tests for critical features (optional but recommended)

### Security Checklist

- [ ] All passwords hashed with bcrypt
- [ ] NextAuth session handling properly configured
- [ ] API routes protected with authentication middleware
- [ ] Role-based access control implemented
- [ ] SQL injection prevention (Prisma handles this)
- [ ] XSS prevention (React handles this)
- [ ] CSRF protection (NextAuth handles this)
- [ ] File upload validation (type, size limits)
- [ ] Rate limiting on public forms
- [ ] Environment variables secured
- [ ] HTTPS in production

### Performance Optimizations

- Use Next.js Image component for all images
- Implement pagination for large lists
- Use server components where possible
- Implement search with debouncing
- Cache static content (ministries, books)
- Optimize database queries (proper indexes)
- Use lazy loading for modals/dialogs
- Compress images before upload
- Minimize client-side JavaScript

### Responsive Design

- Mobile-first approach
- Use Tailwind responsive classes
- Test on: mobile (375px), tablet (768px), desktop (1024px+)
- Touch-friendly buttons (min 44px)
- Readable font sizes (16px+ on mobile)
- Proper spacing and padding

---

## Sample Code Snippets

### NextAuth Configuration

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.isActive) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
});

export { handler as GET, handler as POST };
```

### Middleware for Route Protection

```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Check if user is accessing admin routes
    if (path.startsWith('/admin')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
      }

      // Super admin can access everything
      if (token.role === 'SUPER_ADMIN') {
        return NextResponse.next();
      }

      // Add more role-based checks as needed
      if (path.startsWith('/admin/settings') && token.role !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

export const config = {
  matcher: ['/admin/:path*']
};
```

### Sample API Route (Members)

```typescript
// app/api/members/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// GET - List members with pagination and filters
export async function GET(request: NextRequest) {
  const session = await getServerSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || 'ACTIVE';

  const skip = (page - 1) * limit;

  const where = {
    status: status as any,
    OR: search ? [
      { firstName: { contains: search, mode: 'insensitive' as any } },
      { lastName: { contains: search, mode: 'insensitive' as any } },
      { email: { contains: search, mode: 'insensitive' as any } },
      { phone: { contains: search, mode: 'insensitive' as any } },
    ] : undefined,
  };

  const [members, total] = await Promise.all([
    prisma.member.findMany({
      where,
      skip,
      take: limit,
      include: {
        ministry: true,
        group: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.member.count({ where }),
  ]);

  return NextResponse.json({
    members,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

// POST - Create new member
const memberSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional().nullable(),
  phone: z.string().min(10),
  address: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional().nullable(),
  membershipType: z.enum(['VISITOR', 'NEW_CONVERT', 'MEMBER', 'LEADER', 'PASTOR']).default('VISITOR'),
  ministryId: z.string().optional().nullable(),
  groupId: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  
  if (!session || !['SUPER_ADMIN', 'ADMIN', 'LEADER'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = memberSchema.parse(body);

    const member = await prisma.member.create({
      data: {
        ...validatedData,
        dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null,
      },
      include: {
        ministry: true,
        group: true,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

---

## Testing Strategy

### Manual Testing Checklist

**Admin Portal:**
- [ ] Login/logout functionality
- [ ] Dashboard loads with correct stats
- [ ] Create, read, update, delete members
- [ ] Search and filter members
- [ ] Upload member photos
- [ ] Create and manage follow-ups
- [ ] Create and manage notices
- [ ] Create and manage events
- [ ] Create and manage ministries
- [ ] Mark attendance
- [ ] Send communications
- [ ] View reports
- [ ] Export data
- [ ] Manage users and roles

**Public Website:**
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Ministries pages display correctly
- [ ] Events calendar works
- [ ] Books page shows all books
- [ ] Contact form submits successfully
- [ ] Visitor form submits successfully
- [ ] Prayer request form works
- [ ] Payment integration works (test mode)
- [ ] Mobile responsiveness on all pages
- [ ] Social media links work

### Performance Testing
- [ ] Page load times under 3 seconds
- [ ] Images optimized and compressed
- [ ] No console errors
- [ ] Database queries optimized
- [ ] API response times acceptable

---

## Documentation Deliverables

1. **Admin User Guide** (PDF/Markdown)
   - Getting started
   - Each feature explained with screenshots
   - Common tasks step-by-step
   - Troubleshooting

2. **Developer Documentation**
   - Architecture overview
   - Database schema explanation
   - API endpoints documentation
   - Setup instructions
   - Deployment guide

3. **Video Tutorials** (Optional)
   - Dashboard overview (5 min)
   - Managing members (10 min)
   - Creating events and notices (8 min)
   - Reports and analytics (7 min)

---

## Maintenance Plan

**Daily:**
- Monitor error logs
- Check email/SMS delivery
- Backup database

**Weekly:**
- Review member data quality
- Check follow-up completion rates
- Update notices/events

**Monthly:**
- Generate and review reports
- Clean up expired notices
- Archive old data
- Review user access

**Quarterly:**
- Security updates
- Feature enhancements
- User feedback review
- Performance optimization

---

## Budget Considerations

**Free Tier Options:**
- Vercel (hosting)
- Supabase (database + auth + storage)
- Uploadthing (file uploads - 2GB free)
- Resend (email - 100/day free)

**Paid Services (if needed):**
- Domain name: ~$15/year
- Paystack: Transaction fees only
- SMS API: Pay per SMS
- Premium hosting: ~$20/month (if free tier insufficient)

---

## Success Metrics

**Technical:**
- 99% uptime
- Page load < 3 seconds
- Zero critical bugs
- Mobile responsive

**Business:**
- 100% of members in database within 3 months
- 80% follow-up completion rate
- 50% increase in event attendance tracking
- 90% pastor satisfaction with system

---

## Final Notes

This plan provides a comprehensive roadmap for building a modern church management system. The implementation should be done iteratively, with regular testing and feedback from the pastors and church leaders.

**Priority Order:**
1. Authentication and basic admin setup
2. Members management (core feature)
3. Follow-ups system (high value)
4. Public website (homepage, about, ministries)
5. Events and notices
6. Books section
7. Attendance and reports
8. Communications
9. Additional features

**Remember:**
- Start with MVP features
- Get early feedback from pastors
- Iterate based on real usage
- Keep it simple and user-friendly
- Document everything
- Plan for future growth

---

## Support and Maintenance Contact

After deployment, ensure there's a clear process for:
- Reporting bugs
- Requesting features
- Getting help with the system
- Emergency support

Good luck with the development! 🚀
