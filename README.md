# Event Advertisement Website

## Goal:

Create a platform where users can advertise and manage events. The website will include features for event creation, commenting, rating, and administrative controls.

## Features:

### 1. Event Management:

- **User Actions:**
  - Users can create, edit, and remove their events.
  - Authentication is required for managing events.
  - Users can modify their passwords and usernames.
- **Event Status:**
  - Events will have statuses such as `not confirmed`, `upcoming`, `started`, `ended`.
  - The status will automatically update based on the event’s end date (e.g., if today's date is after the event end date, the status becomes `ended`).

### 2. Comments & Ratings:

- Users can comment on events and rate them **only after** the event has ended.
- Comments can be edited and removed by the author.

### 3. Administration:

- Admins have full control over the platform and can remove events, comments, and manage other content.

### 4. Event Display:

- Events will be listed on the homepage and categorized in suggestion categories.
- Filtering options will be available for events (e.g., by date, price, status).

### 5. Authentication:

- **Admin:** Simple username and password authentication.
- **User:** Email authentication with a verification code sent to their email.

### 6. Payments:

- Users must pay to create an event and have it displayed on the website for a certain duration.
- Once payment is confirmed, the admin receives the order, and communication between the user and admin can occur (consider a built-in real-time chat for this purpose).

### 7. Routing:

- **Home**: Display a simple event list.
- **Events**: Event searching and filtering.
- **Login/Signup**: Authentication page using [Clerk](https://clerk.dev/).
- **Your Events**: Page to manage your created events (view, edit, delete).
- **Profile**: Profile management using Clerk.
- **Notification & Comments**:
  - Users can follow other users to receive notifications when they upload new events.
  - Comments are linked to the specific events where they were posted.
- **Event Details (`/events/:id`)**:
  - View event details.
  - If the event belongs to the user, they will see more options (e.g., edit, delete).
- **Event Audit (`/events/:id/method`)**: Secure actions for event management (authenticate users before proceeding).

### 8. Payment:

- Users must pay to create and display their events.
- Use [Stripe](https://stripe.com/) for payment processing.
- Upon successful payment, an order is created in the system, and the database is updated.

## Database Models (Prisma):

### **Event:**

- `eventId` (String)
- `clerkId` (String) - Clerk authentication ID
- `eventName` (String)
- `eventDescription` (String)
- `eventDate` (DateTime)
- `status` (Enum: `not confirmed`, `upcoming`, `started`, `ended`) - Automatically updated using cron jobs
- `rating` (Number)
- `eventImg` (String) - URL of the event image
- `eventTicketPrice` (Number)
- `eventTicketCurrency` (String)
- `featured` (Boolean)
- `comments` (Relation to `Comment` model)
- `hostName` (String) - Can be fetched from Clerk user details

### **Comment:**

- `commentId` (String)
- `clerkId` (String)
- `authorName` (String)
- `authorImageUrl` (String)
- `createdAt` (DateTime) - Default: `now()`
- `updatedAt` (DateTime) - Updated automatically
- `eventId` (String)

### **Order:**

- `id` (String) - Default: UUID
- `clerkId` (String)
- `orderTotal` (Int) - Default: `0`
- `email` (String)
- `isPaid` (Boolean) - Default: `false`
- `createdAt` (DateTime) - Default: `now()`
- `updatedAt` (DateTime) - Updated automatically

## Additional Considerations:

- **UI/UX**: Focus on user experience after core features are implemented.
- **Storage**: Use a bucket system (e.g., Supabase storage) to store event images.
- **Real-time Chat**: Consider building a real-time chat feature for user/admin communication post-payment.
