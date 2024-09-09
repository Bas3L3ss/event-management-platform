const { PrismaClient, EventType, EventStatus } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const events = [
    {
      id: "7b1f7802-29cb-4c9e-b0b6-5df508295e1e",
      clerkId: "clerk_user_001",
      eventName: "Summer Music Bash",
      eventDescription:
        "A vibrant music festival celebrating summer with live performances.",
      dateStart: new Date("2024-06-20T15:00:00Z"),
      dateEnd: new Date("2024-06-20T23:00:00Z"),
      status: EventStatus.UPCOMING,
      type: EventType.CONCERTS,
      rating: 4,
      eventImg: ["https://example.com/event-images/summer-music-bash.jpg"],
      eventVideo: "https://example.com/event-videos/summer-music-trailer.mp4",
      eventImgOrVideoFirstDisplay:
        "https://example.com/event-images/summer-music-bash.jpg",
      eventTicketPrice: 50.0,
      eventTicketCurrency: "USD",
      eventLocation: "Los Angeles, CA",
      featured: true,
      hostName: "Sunshine Events",
    },
    {
      id: "f3d2c4d5-2c10-4a6a-bb77-66fbac5e5f1f",
      clerkId: "clerk_user_002",
      eventName: "Tech Innovators Summit",
      eventDescription:
        "A 2-day conference showcasing the latest innovations in technology.",
      dateStart: new Date("2024-09-12T09:00:00Z"),
      dateEnd: new Date("2024-09-13T17:00:00Z"),
      status: EventStatus.UPCOMING,
      type: EventType.CONCERTS,
      rating: 5,
      eventImg: ["https://example.com/event-images/tech-innovators-summit.jpg"],
      eventVideo: null,
      eventImgOrVideoFirstDisplay:
        "https://example.com/event-images/tech-innovators-summit.jpg",
      eventTicketPrice: 150.0,
      eventTicketCurrency: "USD",
      eventLocation: "San Francisco, CA",
      featured: false,
      hostName: "Tech World",
    },
    {
      id: "4e2b5c6a-58bc-4dbd-9152-4735c9e84c0a",
      clerkId: "clerk_user_003",
      eventName: "Art & Design Expo",
      eventDescription: "An exhibition of contemporary art and design.",
      dateStart: new Date("2024-11-03T10:00:00Z"),
      dateEnd: new Date("2024-11-03T18:00:00Z"),
      status: EventStatus.UPCOMING,
      type: EventType.CONCERTS,
      rating: 4,
      eventImg: ["https://example.com/event-images/art-design-expo.jpg"],
      eventVideo: "https://example.com/event-videos/art-design-promo.mp4",
      eventImgOrVideoFirstDisplay:
        "https://example.com/event-images/art-design-expo.jpg",
      eventTicketPrice: 25.0,
      eventTicketCurrency: "USD",
      eventLocation: "New York, NY",
      featured: false,
      hostName: "Creative Minds",
    },
    {
      id: "3b5f2294-3d5c-4979-9e83-981e3e0c4f4b",
      clerkId: "clerk_user_004",
      eventName: "Food & Wine Festival",
      eventDescription:
        "A culinary adventure with food and wine from top chefs and vineyards.",
      dateStart: new Date("2024-10-10T12:00:00Z"),
      dateEnd: new Date("2024-10-10T20:00:00Z"),
      status: EventStatus.UPCOMING,
      type: EventType.CONCERTS,
      rating: 5,
      eventImg: ["https://example.com/event-images/food-wine-festival.jpg"],
      eventVideo: null,
      eventImgOrVideoFirstDisplay:
        "https://example.com/event-images/food-wine-festival.jpg",
      eventTicketPrice: 80.0,
      eventTicketCurrency: "USD",
      eventLocation: "Napa Valley, CA",
      featured: true,
      hostName: "Gourmet Events",
    },
    {
      id: "1a7d9487-9e9b-40b0-b8bb-d299c8ef6763",
      clerkId: "clerk_user_005",
      eventName: "Outdoor Adventure Expo",
      eventDescription:
        "Discover the latest outdoor gear and adventure travel destinations.",
      dateStart: new Date("2024-08-20T09:00:00Z"),
      dateEnd: new Date("2024-08-20T18:00:00Z"),
      status: EventStatus.UPCOMING,
      type: EventType.CONCERTS,
      rating: 3,
      eventImg: ["https://example.com/event-images/outdoor-adventure-expo.jpg"],
      eventVideo: "https://example.com/event-videos/adventure-promo.mp4",
      eventImgOrVideoFirstDisplay:
        "https://example.com/event-images/outdoor-adventure-expo.jpg",
      eventTicketPrice: 30.0,
      eventTicketCurrency: "USD",
      eventLocation: "Denver, CO",
      featured: false,
      hostName: "Adventure World",
    },
    {
      id: "bc33c0b3-8166-4c93-bb22-2678a5f7c4bb",
      clerkId: "clerk_user_006",
      eventName: "Yoga & Wellness Retreat",
      eventDescription:
        "A peaceful retreat focusing on yoga, meditation, and wellness.",
      dateStart: new Date("2024-07-15T08:00:00Z"),
      dateEnd: new Date("2024-07-17T17:00:00Z"),
      status: EventStatus.UPCOMING,
      type: EventType.CONCERTS,
      rating: 4,
      eventImg: ["https://example.com/event-images/yoga-wellness-retreat.jpg"],
      eventVideo: null,
      eventImgOrVideoFirstDisplay:
        "https://example.com/event-images/yoga-wellness-retreat.jpg",
      eventTicketPrice: 200.0,
      eventTicketCurrency: "USD",
      eventLocation: "Sedona, AZ",
      featured: true,
      hostName: "Wellness Collective",
    },
    {
      id: "cd06e40e-9eb2-4325-a8c4-e99d3f5ab1b7",
      clerkId: "clerk_user_007",
      eventName: "Film Awards Gala",
      eventDescription:
        "A glamorous evening celebrating the best in film with awards and performances.",
      dateStart: new Date("2024-12-01T19:00:00Z"),
      dateEnd: new Date("2024-12-01T23:00:00Z"),
      status: EventStatus.UPCOMING,
      type: EventType.CONCERTS,
      rating: 5,
      eventImg: ["https://example.com/event-images/film-awards-gala.jpg"],
      eventVideo: "https://example.com/event-videos/film-awards-promo.mp4",
      eventImgOrVideoFirstDisplay:
        "https://example.com/event-images/film-awards-gala.jpg",
      eventTicketPrice: 100.0,
      eventTicketCurrency: "USD",
      eventLocation: "Hollywood, CA",
      featured: true,
      hostName: "Film Society",
    },
    {
      id: "8d09560f-13f3-4f8d-b497-52717c01ad68",
      clerkId: "clerk_user_008",
      eventName: "E-Sports Championship",
      eventDescription:
        "An intense gaming competition with top players from around the world.",
      dateStart: new Date("2024-05-10T12:00:00Z"),
      dateEnd: new Date("2024-05-12T22:00:00Z"),
      status: EventStatus.UPCOMING,
      type: EventType.CONCERTS,
      rating: 4,
      eventImg: ["https://example.com/event-images/e-sports-championship.jpg"],
      eventVideo: null,
      eventImgOrVideoFirstDisplay:
        "https://example.com/event-images/e-sports-championship.jpg",
      eventTicketPrice: 60.0,
      eventTicketCurrency: "USD",
      eventLocation: "Las Vegas, NV",
      featured: true,
      hostName: "Gamer Pro League",
    },
    {
      id: "2a5e29b4-f8b7-4704-9f1b-57c2b70e4cd1",
      clerkId: "clerk_user_009",
      eventName: "Fashion Week Runway",
      eventDescription:
        "An exclusive runway show featuring the latest fashion trends from top designers.",
      dateStart: new Date("2024-09-25T18:00:00Z"),
      dateEnd: new Date("2024-09-25T22:00:00Z"),
      status: EventStatus.UPCOMING,
      type: EventType.CONCERTS,
      rating: 5,
      eventImg: ["https://example.com/event-images/fashion-week-runway.jpg"],
      eventVideo: "https://example.com/event-videos/fashion-week-preview.mp4",
      eventImgOrVideoFirstDisplay:
        "https://example.com/event-images/fashion-week-runway.jpg",
      eventTicketPrice: 120.0,
      eventTicketCurrency: "USD",
      eventLocation: "New York, NY",
      featured: false,
      hostName: "Fashion Forward",
    },
    {
      id: "ef1c46e3-a876-4f4f-b7d8-b8270d1a6e80",
      clerkId: "clerk_user_010",
      eventName: "Holiday Craft Fair",
      eventDescription:
        "A festive market with handmade crafts, holiday treats, and more.",
      dateStart: new Date("2024-12-15T10:00:00Z"),
      dateEnd: new Date("2024-12-15T17:00:00Z"),
      status: EventStatus.UPCOMING,
      type: EventType.CONCERTS,
      rating: 3,
      eventImg: ["https://example.com/event-images/holiday-craft-fair.jpg"],
      eventVideo: null,
      eventImgOrVideoFirstDisplay:
        "https://example.com/event-images/holiday-craft-fair.jpg",
      eventTicketPrice: 10.0,
      eventTicketCurrency: "USD",
      eventLocation: "Portland, OR",
      featured: false,
      hostName: "Craft & Trade",
    },
  ];

  for (const event of events) {
    await prisma.event.create({
      data: event,
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
