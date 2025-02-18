import Image from "next/image";

export default function AboutUsPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <header className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">About Us</h1>
          <p className="text-xl">
            Learn more about our event management platform
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Who We Are</h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <p className="text-lg mb-4">
                We are a passionate team of event professionals dedicated to
                revolutionizing the way events are planned and executed. With
                years of experience in the industry, we understand the
                challenges event organizers face and have built a platform to
                address those needs.
              </p>
              <p className="text-lg">
                Our goal is to empower event planners with cutting-edge tools
                and resources, making event management more efficient,
                enjoyable, and successful.
              </p>
            </div>
            <div className="md:w-1/2">
              <Image
                src="/placeholder.svg?height=300&width=400"
                alt="Our team"
                width={400}
                height={300}
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Our Vision</h2>
          <div className="bg-secondary text-secondary-foreground p-6 rounded-lg shadow-sm">
            <p className="text-lg">
              To be the leading global platform that transforms event
              management, connecting organizers, attendees, and vendors in a
              seamless, innovative ecosystem that brings extraordinary events to
              life.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-muted text-muted-foreground p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Simplify</h3>
              <p>
                Streamline event planning processes, reducing complexity and
                saving time for organizers.
              </p>
            </div>
            <div className="bg-muted text-muted-foreground p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Innovate</h3>
              <p>
                Continuously develop and integrate cutting-edge technologies to
                enhance event experiences.
              </p>
            </div>
            <div className="bg-muted text-muted-foreground p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p>
                Foster meaningful connections between event stakeholders,
                creating vibrant communities.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">
            Join Us on Our Journey
          </h2>
          <p className="text-lg mb-4">
            We're excited about the future of event management and invite you to
            be a part of it. Whether you're an event organizer, attendee, or
            vendor, our platform is designed to elevate your event experience.
          </p>
          <a
            href="#"
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Get Started Today
          </a>
        </section>
      </main>
    </div>
  );
}
