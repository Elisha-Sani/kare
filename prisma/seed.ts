// prisma/seed.ts
import { PrismaClient, RequestStatus, TestimonialStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 🔄 Clear old data
  await prisma.request.deleteMany({});
  await prisma.testimonial.deleteMany({});

  // 📌 Insert Requests (with one soft deleted)
  await prisma.request.createMany({
    data: [
      {
        firstName: "Alice",
        lastName: "Johnson",
        email: "alicejohnson@gmail.com",
        eventType: "Birthday",
        details: "A 30th birthday party at home",
        status: RequestStatus.PENDING,
      },
      {
        firstName: "Michael",
        lastName: "Smith",
        email: "micsmith@yahoo.com",
        eventType: "Wedding",
        details: "Wedding reception with 200 guests",
        status: RequestStatus.IN_PROGRESS,
      },
      {
        firstName: "Samantha",
        lastName: "Lee",
        email: "lee@email.com",
        eventType: "Corporate",
        details: "Company annual dinner",
        status: RequestStatus.COMPLETED,
      },
    ],
  });

  // 🗑 Example soft-deleted Request
  await prisma.request.create({
    data: {
      firstName: "David",
      lastName: "Brown",
      email: "david.brown@test.com",
      eventType: "Graduation",
      details: "Small graduation celebration",
      status: RequestStatus.CANCELLED,
      deletedAt: new Date(), // Soft deleted
    },
  });

  // 📌 Insert Testimonials
  await prisma.testimonial.createMany({
    data: [
      {
        name: "John Doe",
        email: "johndoe@example.com",
        comment: "This service was fantastic! Everything went smoothly.",
        rating: 5,
        status: TestimonialStatus.APPROVED,
      },
      {
        name: "Jane Smith",
        email: "janesmith@example.com",
        comment: "Good experience overall, but there’s room for improvement.",
        rating: 4,
        status: TestimonialStatus.PENDING,
      },
      {
        name: "Carlos Alvarez",
        email: "carlos.alvarez@email.com",
        comment: "Not very satisfied with the support I received.",
        rating: 2,
        status: TestimonialStatus.REJECTED,
      },
      {
        name: "Emily Johnson",
        email: "emilyj@example.com",
        comment: "Quick response time and friendly staff. Highly recommend!",
        rating: 5,
        status: TestimonialStatus.APPROVED,
      },
      {
        name: "Daniel Kim",
        email: "daniel.kim@email.com",
        comment: "Decent service, but the process felt a little slow.",
        rating: 3,
        status: TestimonialStatus.PENDING,
      },
    ],
  });

  console.log(
    "✅ Database has been seeded with mock data (including soft delete test)!"
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
