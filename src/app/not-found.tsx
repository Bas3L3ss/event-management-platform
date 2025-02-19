import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative overflow-hidden min-h-screen flex items-center justify-center isolate bg-gradient-to-br from-background to-primary/10">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="not-found-pattern"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 32V.5H32"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.1"
              ></path>
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#not-found-pattern)"
          ></rect>
        </svg>
      </div>

      <div className="relative z-10 text-center">
        <div className="max-w-3xl px-6">
          <AlertCircle className="mx-auto text-primary w-24 h-24 mb-8" />
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Oops! Page Not Found
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            It seems the event you're looking for has vanished into thin air.
            Don't worry, there are plenty more experiences waiting for you!
          </p>
          <Button asChild size="lg" className="group">
            <Link href="/">
              <Home className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Return to Homepage
            </Link>
          </Button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-72 h-72 bg-primary/30 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute top-1/2 right-0 translate-y-1/2 translate-x-1/2 w-72 h-72 bg-secondary/30 rounded-full blur-3xl opacity-50"></div>
    </div>
  );
}
