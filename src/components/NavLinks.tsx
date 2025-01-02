import { auth } from "@clerk/nextjs/server";
import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { LogInCheck, SignUpAndSignInCheck } from "./SignUpSignInLogOutCheck";
import { getUnseenNotificationsByClerkId } from "@/utils/actions/usersActions";
import { Notification as NotificationType } from "@prisma/client";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Sign Up",
    href: "/sign-up",
    description: "Sign Up to use our service.",
  },
  {
    title: "Sign In",
    href: "/sign-in",
    description: "Sign in to use our service.",
  },
  {
    title: "My Profile",
    href: "/profile",
    description: "You can review your account here.",
  },
  {
    title: "Profile Setting",
    href: "/profile/profileedit",
    description: "You can edit your account here.",
  },

  {
    title: "Notifications",
    href: "/notifications",
    description: "Check out for events and news from those who you followed.",
  },
  {
    title: "About Us",
    href: "/aboutus",
    description: "Our visions and missions.",
  },
  {
    title: "Log out",
    href: "/",
    description: "Hope you'll comeback!",
  },
];
const adminComponents: { title: string; href: string; description: string }[] =
  [
    {
      title: "Events",
      href: "/admin/events",
      description: "Check Events.",
    },
    {
      title: "Orders",
      href: "/admin/orders",
      description: "Check Orders.",
    },
  ];

const NotificationMenuItem = ({
  href,
  title,
  description,
  unSeenCount,
}: {
  href: string;
  title: string;
  description: string;
  unSeenCount?: number;
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="text-sm font-medium leading-none flex items-center gap-2">
            <p className={cn(unSeenCount && unSeenCount > 0 && "text-primary")}>
              {title}
            </p>

            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground opacity-0",
                unSeenCount && unSeenCount > 0 && "opacity-100"
              )}
            >
              {unSeenCount}
            </span>
          </div>
          <p
            className={cn(
              "line-clamp-2 text-sm leading-snug text-muted-foreground"
            )}
          >
            {description}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
};

export async function NavLinks({
  unSeenNotificationsCount,
}: {
  unSeenNotificationsCount?: number;
}) {
  const userId = auth().userId;
  const isAdmin = userId === process.env.CLERK_ADMIN_ID;

  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/ " legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="z-10">
            <NavigationMenuTrigger>Events</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                <li className="h-full ">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/events"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">
                        Events Search
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Find more events here.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li className="h-full ">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/events/myevents"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">
                        My Events
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Manage your events here.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem
            className={cn(
              "!z-10",
              unSeenNotificationsCount &&
                unSeenNotificationsCount > 0 &&
                "text-primary"
            )}
          >
            <NavigationMenuTrigger>My Profile</NavigationMenuTrigger>
            <NavigationMenuContent className="!z-10">
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {components.map((component) => {
                  if (component.title === "Sign Up") {
                    return (
                      <SignUpAndSignInCheck
                        title={component.title}
                        href={component.href}
                        key={component.title}
                        description={component.description}
                      />
                    );
                  } else if (component.title === "Sign In") {
                    return (
                      <SignUpAndSignInCheck
                        title={component.title}
                        href={component.href}
                        key={component.title}
                        description={component.description}
                      />
                    );
                  } else if (component.title === "Log out") {
                    return (
                      <LogInCheck
                        key={component.title}
                        title={component.title}
                        href={component.href}
                        description={component.description}
                      />
                    );
                  } else if (component.title === "Notifications") {
                    return (
                      <NotificationMenuItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                        description={component.description}
                        unSeenCount={unSeenNotificationsCount}
                      />
                    );
                  } else
                    return (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                        {component.description}
                      </ListItem>
                    );
                })}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {isAdmin && (
            <NavigationMenuItem>
              <NavigationMenuTrigger>Admin DashBoard</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {adminComponents.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}

          <NavigationMenuItem>
            <Link href="/events/orders" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Your Orders
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
}

export const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    title: React.ReactNode;
  }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
