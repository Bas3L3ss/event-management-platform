const { PrismaClient, EventType, EventStatus } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const events = [
    {
      clerkId: "user_2mPkcZJJEbsk1q1CCAJXq4ejfKm",
      eventName: "Summer Music Festival 2024",
      eventDescription:
        "Join us for an unforgettable summer music festival featuring top artists from around the world. Live performances, food vendors, and amazing atmosphere!",
      dateStart: new Date("2024-07-15T14:00:00Z"),
      dateEnd: new Date("2024-07-17T23:00:00Z"),
      status: EventStatus.UPCOMING,
      type: "SPORTS",
      rating: 4.8,
      eventImg: [],
      eventImgOrVideoFirstDisplay: "",
      eventTicketPrice: 150.0,
      eventLocation: "Central Park, New York",
      reservationTicketLink: "https://tickets.example.com/summer-fest",
      featured: true,
      hostName: "NYC Events Co",
    },
    {
      clerkId: "user_2mPkcZJJEbsk1q1CCAJXq4ejfKm",
      eventName: "Tech Innovation Summit",
      eventDescription:
        "A premier technology conference bringing together industry leaders, innovators, and entrepreneurs to discuss the future of tech.",
      dateStart: new Date("2024-03-20T09:00:00Z"),
      dateEnd: new Date("2024-03-22T17:00:00Z"),
      status: EventStatus.UPCOMING,
      type: "SPORTS",
      rating: 4.5,
      eventImg: [],
      eventImgOrVideoFirstDisplay: "",
      eventTicketPrice: 299.99,
      eventLocation: "Convention Center, San Francisco",
      reservationTicketLink: "https://tickets.example.com/tech-summit",
      featured: true,
      hostName: "TechCon Events",
    },
    {
      clerkId: "user_2mPkcZJJEbsk1q1CCAJXq4ejfKm",
      eventName: "Global Food Festival",
      eventDescription:
        "Experience cuisines from around the world with top chefs, cooking demonstrations, and food tastings.",
      dateStart: new Date("2024-05-10T11:00:00Z"),
      dateEnd: new Date("2024-05-12T22:00:00Z"),
      status: EventStatus.UPCOMING,
      type: "SPORTS",
      rating: 4.7,
      eventImg: [],
      eventImgOrVideoFirstDisplay: "",
      eventTicketPrice: 75.0,
      eventLocation: "Pier 39, San Francisco",
      reservationTicketLink: "https://tickets.example.com/food-fest",
      featured: false,
      hostName: "Global Tastes Inc",
    },
    {
      clerkId: "user_2mPkcZJJEbsk1q1CCAJXq4ejfKm",
      eventName: "Digital Art Exhibition",
      eventDescription:
        "Immersive digital art exhibition featuring works from contemporary artists using cutting-edge technology.",
      dateStart: new Date("2024-04-05T10:00:00Z"),
      dateEnd: new Date("2024-04-30T19:00:00Z"),
      status: EventStatus.UPCOMING,
      type: "SPORTS",
      rating: 4.6,
      eventImg: [],
      eventImgOrVideoFirstDisplay: "",
      eventTicketPrice: 25.0,
      eventLocation: "Modern Art Museum, Los Angeles",
      reservationTicketLink: "https://tickets.example.com/digital-art",
      featured: true,
      hostName: "Digital Arts Collective",
    },
    {
      clerkId: "user_2mPkcZJJEbsk1q1CCAJXq4ejfKm",
      eventName: "Marathon for Charity",
      eventDescription:
        "Annual charity marathon supporting local community initiatives. Join us for a day of running and giving back.",
      dateStart: new Date("2024-09-15T07:00:00Z"),
      dateEnd: new Date("2024-09-15T15:00:00Z"),
      status: EventStatus.UPCOMING,
      type: "SPORTS",
      rating: 4.9,
      eventImg: [],
      eventImgOrVideoFirstDisplay: "",
      eventTicketPrice: 50.0,
      eventLocation: "Downtown Chicago",
      reservationTicketLink: "https://tickets.example.com/charity-marathon",
      featured: false,
      hostName: "Chicago Sports Events",
    },
  ];

  for (const event of events) {
    await prisma.event.delete({
      where: {
        eventName: event.eventName,
      },
    });
  }

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
