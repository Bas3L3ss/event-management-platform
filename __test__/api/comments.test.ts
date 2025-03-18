import { POST } from "@/app/api/comments/route";
import { createComment } from "@/utils/actions/eventsActions";

jest.mock("@/utils/actions/eventsActions", () => ({
  createComment: jest.fn(),
}));

describe("POST /api/comments", () => {
  it("should create a comment and return 201 status", async () => {
    const requestBody = {
      clerkId: "user-id",
      commentText: "Great event!",
      rating: 5,
      eventId: "event-id",
      authorName: "John Doe",
      authorImageUrl: "http://example.com/image.jpg",
    };

    const request = new Request("http://localhost/api/comments", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });
    //@ts-expect-error:no prob
    createComment.mockResolvedValue({ id: "comment-id" });

    const response = await POST(request);

    expect(response.status).toBe(201);
    expect(createComment).toHaveBeenCalledWith(requestBody);
  });
});
