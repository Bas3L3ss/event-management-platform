import {
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  BellIcon,
  ListFilter,
  HeartIcon,
  CheckCheckIcon,
  Home,
} from "lucide-react";
import { Group } from "../types/NavTypes";

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/",
          label: "Home",
          active: pathname === "/",
          icon: Home,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/aboutus",
          label: "About Us",
          active: pathname.includes("/aboutus"),
          icon: HeartIcon,
          submenus: [],
        },
      ],
    },

    {
      groupLabel: "Contents",
      menus: [
        {
          href: "",
          label: "Events",
          active: pathname.includes("/events"),
          icon: CheckCheckIcon,
          submenus: [
            {
              href: "/events",
              label: "All Events",
              active: pathname === "/events",
            },
            {
              href: "/events/myevents",
              label: "My Events",
              active: pathname === "/events/myevents",
            },
          ],
        },
        {
          href: "/events/orders",
          label: "My Orders",
          active: pathname.includes("/events/orders"),
          icon: ListFilter,
          submenus: [],
        },
        {
          href: "/notifications",
          label: "Notifications",
          active: pathname.includes("/notifications"),
          icon: BellIcon,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Profile Settings",
      menus: [
        {
          href: "/profile",
          label: "My Profile",
          active: pathname.includes("/profile"),
          icon: Users,
          submenus: [],
        },
        {
          href: "/profile/profileedit",
          label: "Profile Setting",
          active: pathname.includes("/profile/profileedit"),
          icon: Settings,
          submenus: [],
        },
      ],
    },
  ];
}
