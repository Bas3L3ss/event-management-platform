type NavLink = {
  href: string;
  label: string;
};

export const links: NavLink[] = [
  { href: "/", label: "home" },
  { href: "/events", label: "events" },
  { href: "/events/myevents", label: "myevents" },
  { href: "/events/orders", label: "orders" },
  { href: "/notifications", label: "notifications" },
  { href: "/admin/orders", label: "dashboard" },
];

export const adminLinks: NavLink[] = [
  { href: "/admin/orders", label: "orders" },
  { href: "/admin/events", label: "events" },
];
