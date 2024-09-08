"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu as MenuIcon } from "lucide-react";
import Logo from "./Logo";
import MobileNavBarLinks from "./MobileNavBarLinks";
import { ModeToggle } from "./ThemeToggle";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden flex justify-between items-center">
      <Sheet open={open} onOpenChange={setOpen}>
        {/* This button will trigger open the mobile sheet menu */}
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <MenuIcon />
          </Button>
        </SheetTrigger>

        <SheetContent side="left">
          <button
            className=" border-b w-full flex justify-start "
            onClick={() => setOpen(false)}
          >
            <Logo className=" underline px-4 pb-5  " />
          </button>
          <MobileNavBarLinks isOpen={open} />
        </SheetContent>
      </Sheet>
      <ModeToggle />
    </div>
  );
}
