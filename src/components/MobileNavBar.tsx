"use client";

import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu as MenuIcon } from "lucide-react";
import Logo from "./Logo";
import MobileNavBarLinks from "./MobileNavBarLinks";
import { ModeToggle } from "./ThemeToggle";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

export default function MobileNav({
  userId,
  unSeenNotificationsCount,
}: {
  userId: string | null;
  unSeenNotificationsCount?: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden flex justify-between items-center">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "md:hidden relative",
              unSeenNotificationsCount &&
                unSeenNotificationsCount > 0 &&
                "text-primary"
            )}
          >
            <MenuIcon />
            {unSeenNotificationsCount && unSeenNotificationsCount > 0 && (
              <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-xs">
                {unSeenNotificationsCount}
              </span>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent side="left">
          <button
            className=" border-b w-full flex justify-start "
            onClick={() => setOpen(false)}
          >
            <Logo className=" underline px-4 pb-5  " />
          </button>
          <MobileNavBarLinks
            unseenAmount={unSeenNotificationsCount}
            userId={userId}
            isOpen={open}
          />
        </SheetContent>
      </Sheet>
      <span className="flex items-center justify-center gap-2">
        <ModeToggle />
        <UserButton />
      </span>
    </div>
  );
}
