-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'LEADER', 'MEMBER');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED');

-- CreateEnum
CREATE TYPE "MembershipType" AS ENUM ('VISITOR', 'NEW_CONVERT', 'MEMBER', 'LEADER', 'PASTOR');

-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'TRANSFERRED', 'DECEASED');

-- CreateEnum
CREATE TYPE "FollowUpReason" AS ENUM ('NEW_VISITOR', 'NEW_CONVERT', 'ABSENT', 'SICK', 'PRAYER_REQUEST', 'COUNSELING', 'MEMBERSHIP', 'BAPTISM', 'OTHER');

-- CreateEnum
CREATE TYPE "ContactMethod" AS ENUM ('PHONE_CALL', 'TEXT_MESSAGE', 'WHATSAPP', 'EMAIL', 'HOME_VISIT', 'CHURCH_VISIT');

-- CreateEnum
CREATE TYPE "FollowUpStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_RESPONSE');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "NoticeCategory" AS ENUM ('GENERAL', 'URGENT', 'EVENT', 'PRAYER', 'MINISTRY', 'YOUTH', 'ADMINISTRATIVE');

-- CreateEnum
CREATE TYPE "TargetAudience" AS ENUM ('EVERYONE', 'MEMBERS_ONLY', 'LEADERS_ONLY', 'SPECIFIC_MINISTRY');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('SERVICE', 'PRAYER_MEETING', 'BIBLE_STUDY', 'CONFERENCE', 'SEMINAR', 'WORKSHOP', 'OUTREACH', 'SOCIAL', 'FUNDRAISER', 'BAPTISM', 'WEDDING', 'FUNERAL', 'OTHER');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'POSTPONED');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('SUNDAY_SERVICE', 'MIDWEEK_SERVICE', 'PRAYER_MEETING', 'BIBLE_STUDY', 'SPECIAL_EVENT', 'OTHER');

-- CreateEnum
CREATE TYPE "BookCategory" AS ENUM ('CHRISTIAN_LIVING', 'THEOLOGY', 'DEVOTIONAL', 'PRAYER', 'FAITH', 'MINISTRY', 'LEADERSHIP', 'FAMILY', 'YOUTH', 'OTHER');

-- CreateEnum
CREATE TYPE "SermonCategory" AS ENUM ('SUNDAY_SERVICE', 'MIDWEEK_SERVICE', 'SPECIAL_EVENT', 'CONFERENCE', 'SERIES', 'GUEST_SPEAKER');

-- CreateEnum
CREATE TYPE "PledgeType" AS ENUM ('TITHE', 'OFFERING', 'BUILDING_FUND', 'MISSIONS', 'SPECIAL_PROJECT', 'OTHER');

-- CreateEnum
CREATE TYPE "PledgeFrequency" AS ENUM ('ONE_TIME', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "PledgeStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PrayerCategory" AS ENUM ('GENERAL', 'HEALTH', 'FAMILY', 'FINANCIAL', 'EMPLOYMENT', 'SPIRITUAL', 'SALVATION', 'DIRECTION', 'OTHER');

-- CreateEnum
CREATE TYPE "PrayerStatus" AS ENUM ('SUBMITTED', 'PRAYING', 'ANSWERED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ContactCategory" AS ENUM ('GENERAL', 'PRAYER_REQUEST', 'VISITOR_INFO', 'PARTNERSHIP', 'MEDIA_INQUIRY', 'COMPLAINT', 'SUGGESTION');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'RESPONDED', 'CLOSED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "alternatePhone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "province" TEXT,
    "postalCode" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" "Gender",
    "maritalStatus" "MaritalStatus",
    "photoUrl" TEXT,
    "membershipType" "MembershipType" NOT NULL DEFAULT 'VISITOR',
    "joinDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "baptized" BOOLEAN NOT NULL DEFAULT false,
    "baptismDate" TIMESTAMP(3),
    "salvationDate" TIMESTAMP(3),
    "ministryId" TEXT,
    "groupId" TEXT,
    "familyId" TEXT,
    "status" "MemberStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Family" (
    "id" TEXT NOT NULL,
    "familyName" TEXT NOT NULL,
    "headOfHousehold" TEXT,
    "address" TEXT,
    "city" TEXT,
    "province" TEXT,
    "postalCode" TEXT,
    "homePhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Family_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ministry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "vision" TEXT,
    "mission" TEXT,
    "leaderId" TEXT,
    "leaderName" TEXT,
    "leaderEmail" TEXT,
    "leaderPhone" TEXT,
    "imageUrl" TEXT,
    "bannerUrl" TEXT,
    "meetingDay" TEXT,
    "meetingTime" TEXT,
    "meetingLocation" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOnWebsite" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ministry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "leaderId" TEXT,
    "leaderName" TEXT,
    "ministryId" TEXT,
    "meetingDay" TEXT,
    "meetingTime" TEXT,
    "meetingLocation" TEXT,
    "maxMembers" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowUp" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "assignedToId" TEXT NOT NULL,
    "assignedToName" TEXT NOT NULL,
    "reason" "FollowUpReason" NOT NULL,
    "reasonOther" TEXT,
    "priority" "Priority" NOT NULL DEFAULT 'NORMAL',
    "method" "ContactMethod",
    "status" "FollowUpStatus" NOT NULL DEFAULT 'PENDING',
    "dueDate" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "initialNotes" TEXT,
    "followUpNotes" TEXT,
    "outcome" TEXT,
    "requiresFollowUp" BOOLEAN NOT NULL DEFAULT false,
    "nextFollowUpDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FollowUp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notice" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "summary" TEXT,
    "priority" "Priority" NOT NULL DEFAULT 'NORMAL',
    "category" "NoticeCategory" NOT NULL DEFAULT 'GENERAL',
    "displayOnWebsite" BOOLEAN NOT NULL DEFAULT true,
    "displayInAdmin" BOOLEAN NOT NULL DEFAULT true,
    "targetAudience" "TargetAudience" NOT NULL DEFAULT 'EVERYONE',
    "publishDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "imageUrl" TEXT,
    "attachmentUrl" TEXT,
    "createdById" TEXT NOT NULL,
    "createdByName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "startTime" TEXT,
    "endTime" TEXT,
    "isAllDay" BOOLEAN NOT NULL DEFAULT false,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrenceRule" TEXT,
    "location" TEXT NOT NULL,
    "address" TEXT,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "onlineLink" TEXT,
    "eventType" "EventType" NOT NULL DEFAULT 'SERVICE',
    "ministryId" TEXT,
    "groupId" TEXT,
    "requiresRSVP" BOOLEAN NOT NULL DEFAULT false,
    "maxAttendees" INTEGER,
    "registrationDeadline" TIMESTAMP(3),
    "imageUrl" TEXT,
    "posterUrl" TEXT,
    "displayOnWebsite" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "status" "EventStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "eventId" TEXT,
    "serviceDate" TIMESTAMP(3) NOT NULL,
    "serviceType" "ServiceType" NOT NULL DEFAULT 'SUNDAY_SERVICE',
    "present" BOOLEAN NOT NULL DEFAULT true,
    "checkInTime" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "author" TEXT NOT NULL DEFAULT 'Apostle Charles Magaiza',
    "description" TEXT NOT NULL,
    "shortDescription" TEXT,
    "isbn" TEXT,
    "publisher" TEXT,
    "publishedDate" TIMESTAMP(3),
    "edition" TEXT,
    "pageCount" INTEGER,
    "language" TEXT NOT NULL DEFAULT 'English',
    "price" DECIMAL(10,2),
    "currency" TEXT NOT NULL DEFAULT 'ZAR',
    "amazonUrl" TEXT NOT NULL,
    "otherPurchaseUrls" JSONB,
    "coverImageUrl" TEXT NOT NULL,
    "samplePdfUrl" TEXT,
    "category" "BookCategory" NOT NULL DEFAULT 'CHRISTIAN_LIVING',
    "tags" TEXT[],
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sermon" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "preacher" TEXT NOT NULL DEFAULT 'Apostle Charles Magaiza',
    "sermonDate" TIMESTAMP(3) NOT NULL,
    "series" TEXT,
    "topic" TEXT,
    "scripture" TEXT,
    "videoUrl" TEXT,
    "audioUrl" TEXT,
    "notesUrl" TEXT,
    "thumbnailUrl" TEXT,
    "tags" TEXT[],
    "category" "SermonCategory" NOT NULL DEFAULT 'SUNDAY_SERVICE',
    "views" INTEGER NOT NULL DEFAULT 0,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sermon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pledge" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "pledgeType" "PledgeType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ZAR',
    "frequency" "PledgeFrequency" NOT NULL DEFAULT 'ONE_TIME',
    "pledgeDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "amountPaid" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "status" "PledgeStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pledge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrayerRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "category" "PrayerCategory" NOT NULL DEFAULT 'GENERAL',
    "request" TEXT NOT NULL,
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "shareWithPastors" BOOLEAN NOT NULL DEFAULT true,
    "shareWithLeaders" BOOLEAN NOT NULL DEFAULT false,
    "status" "PrayerStatus" NOT NULL DEFAULT 'SUBMITTED',
    "prayedBy" TEXT[],
    "prayerCount" INTEGER NOT NULL DEFAULT 0,
    "hasTestimony" BOOLEAN NOT NULL DEFAULT false,
    "testimony" TEXT,
    "testimonyDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrayerRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "category" "ContactCategory" NOT NULL DEFAULT 'GENERAL',
    "status" "MessageStatus" NOT NULL DEFAULT 'NEW',
    "assignedTo" TEXT,
    "response" TEXT,
    "respondedAt" TIMESTAMP(3),
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Ministry_name_key" ON "Ministry"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Ministry_slug_key" ON "Ministry"("slug");

-- CreateIndex
CREATE INDEX "Notice_publishDate_expiryDate_isActive_idx" ON "Notice"("publishDate", "expiryDate", "isActive");

-- CreateIndex
CREATE INDEX "Event_eventDate_status_idx" ON "Event"("eventDate", "status");

-- CreateIndex
CREATE INDEX "Attendance_serviceDate_present_idx" ON "Attendance"("serviceDate", "present");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_memberId_serviceDate_serviceType_key" ON "Attendance"("memberId", "serviceDate", "serviceType");

-- CreateIndex
CREATE INDEX "Book_isFeatured_displayOrder_idx" ON "Book"("isFeatured", "displayOrder");

-- CreateIndex
CREATE INDEX "Sermon_sermonDate_isFeatured_idx" ON "Sermon"("sermonDate", "isFeatured");

-- CreateIndex
CREATE INDEX "PrayerRequest_status_isUrgent_category_idx" ON "PrayerRequest"("status", "isUrgent", "category");

-- CreateIndex
CREATE INDEX "ContactMessage_status_category_idx" ON "ContactMessage"("status", "category");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_key_key" ON "Settings"("key");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_ministryId_fkey" FOREIGN KEY ("ministryId") REFERENCES "Ministry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_ministryId_fkey" FOREIGN KEY ("ministryId") REFERENCES "Ministry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUp" ADD CONSTRAINT "FollowUp_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUp" ADD CONSTRAINT "FollowUp_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notice" ADD CONSTRAINT "Notice_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_ministryId_fkey" FOREIGN KEY ("ministryId") REFERENCES "Ministry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pledge" ADD CONSTRAINT "Pledge_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
