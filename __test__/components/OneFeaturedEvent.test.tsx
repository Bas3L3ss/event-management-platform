import OneFeaturedEvent from "@/components/OneFeaturedEvent";
import { Event, EventStatus, EventType } from "@prisma/client";
import { render, screen } from "@testing-library/react";

describe("Homepage", () => {
  const mockEvent: Event = {
    id: "123e4567-e89b-12d3-a456-426614174000", // UUID
    clerkId: "clerk123",
    eventName: "Music Festival 2024",
    eventDescription:
      "A vibrant and exciting music festival with various artists.",
    dateStart: new Date("2024-05-01T10:00:00Z"),
    dateEnd: new Date("2024-05-03T22:00:00Z"),
    status: EventStatus.NOT_CONFIRMED, // Enum value
    type: EventType.CORPORATE_RETREATS, // Enum value (replace with your actual types)
    rating: 4.7,
    eventImg: [""],
    eventVideo: "",
    eventImgOrVideoFirstDisplay: "",
    eventTicketPrice: 50.0,
    eventLocation: "Central Park, NY",
    reservationTicketLink: "https://tickets.example.com/music-festival-2024",
    createdAt: new Date("2024-04-01T08:00:00Z"),
    updatedAt: new Date(),
    activationTotal: 1000,
    featured: true,
    hostName: "John Doe",
  };

  it("should render one featured event", () => {
    render(<OneFeaturedEvent commentsLength={9} featuredEvent={mockEvent} />);

    expect(screen.getByText(/vibrant/i)).toBeInTheDocument();
  });
});
