"use client";

import Link from "next/link";
import { Ellipsis, LogOut, SignpostIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { getMenuList } from "@/utils/datas/menuList";
import { CollapseMenuButton } from "./CollaspeMenuButton";
import { SignInButton, SignOutButton, SignUpButton } from "@clerk/nextjs";

interface MenuProps {
  isOpen: boolean | undefined;
  userId: string | null;
  unseenAmount?: number;
}

function MobileNavBarLinks({ isOpen, userId, unseenAmount }: MenuProps) {
  const pathname = usePathname();

  const menuList = getMenuList(pathname);

  return (
    <div>
      <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2">
        {menuList.map(({ groupLabel, menus }, index) => (
          <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
            {(isOpen && groupLabel) || isOpen === undefined ? (
              <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                {groupLabel}
              </p>
            ) : !isOpen && isOpen !== undefined && groupLabel ? (
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger className="w-full">
                    <div className="w-full flex justify-center items-center">
                      <Ellipsis className="h-5 w-5" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{groupLabel} </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <p className="pb-2"></p>
            )}
            {menus.map(({ href, label, icon: Icon, active, submenus }, index) =>
              submenus.length === 0 ? (
                <div className="w-full" key={index}>
                  <TooltipProvider disableHoverableContent>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={active ? "secondary" : "ghost"}
                          className="w-full justify-start h-10 mb-1"
                          asChild
                        >
                          <Link href={href}>
                            <span
                              className={cn(
                                isOpen === false ? "" : "mr-4",
                                label === "Notifications" &&
                                  unseenAmount &&
                                  unseenAmount > 0 &&
                                  "text-primary"
                              )}
                            >
                              <Icon size={18} />
                            </span>
                            <div className="flex items-center gap-2">
                              <p
                                className={cn(
                                  "max-w-[200px] truncate",
                                  isOpen === false
                                    ? "-translate-x-96 opacity-0"
                                    : "translate-x-0 opacity-100",
                                  label === "Notifications" &&
                                    unseenAmount &&
                                    unseenAmount > 0 &&
                                    "text-primary"
                                )}
                              >
                                {label}
                              </p>
                              {label === "Notifications" &&
                                unseenAmount &&
                                unseenAmount > 0 && (
                                  <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                                    {unseenAmount}
                                  </span>
                                )}
                            </div>
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      {isOpen === false && (
                        <TooltipContent side="right">
                          <div className="flex items-center gap-2">
                            {label}
                            {label === "Notifications" &&
                              unseenAmount &&
                              unseenAmount > 0 && (
                                <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                                  {unseenAmount}
                                </span>
                              )}
                          </div>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ) : (
                <div className="w-full" key={index}>
                  <CollapseMenuButton
                    icon={Icon}
                    label={label}
                    active={active}
                    submenus={submenus}
                    isOpen={isOpen}
                  />
                </div>
              )
            )}
          </li>
        ))}
        <li className="w-full grow flex items-end gap-3">
          {userId && (
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <SignOutButton>
                    <Button
                      onClick={() => {}}
                      variant="outline"
                      className="w-full justify-center h-10 mt-5"
                    >
                      <span className={cn(isOpen === false ? "" : "mr-4")}>
                        <LogOut size={18} />
                      </span>
                      <p
                        className={cn(
                          "whitespace-nowrap",
                          isOpen === false ? "opacity-0 hidden" : "opacity-100"
                        )}
                      >
                        Log out
                      </p>
                    </Button>
                  </SignOutButton>
                </TooltipTrigger>
                {isOpen === false && (
                  <TooltipContent side="right">Log Out</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          )}
          {!userId && (
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <SignInButton>
                    <Button
                      onClick={() => {}}
                      variant="outline"
                      className="w-full justify-center h-10 mt-5"
                    >
                      <span className={cn(isOpen === false ? "" : "mr-4")}>
                        <SignpostIcon size={18} />
                      </span>
                      <p
                        className={cn(
                          "whitespace-nowrap",
                          isOpen === false ? "opacity-0 hidden" : "opacity-100"
                        )}
                      >
                        Sign in
                      </p>
                    </Button>
                  </SignInButton>
                </TooltipTrigger>
                {isOpen === false && (
                  <TooltipContent side="right">Sign in</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          )}
          {!userId && (
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <SignUpButton>
                    <Button
                      onClick={() => {}}
                      variant="outline"
                      className="w-full justify-center h-10 mt-5"
                    >
                      <span className={cn(isOpen === false ? "" : "mr-4")}>
                        <SignpostIcon size={18} />
                      </span>
                      <p
                        className={cn(
                          "whitespace-nowrap",
                          isOpen === false ? "opacity-0 hidden" : "opacity-100"
                        )}
                      >
                        Sign up
                      </p>
                    </Button>
                  </SignUpButton>
                </TooltipTrigger>
                {isOpen === false && (
                  <TooltipContent side="right">Sign up</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          )}
        </li>
      </ul>
    </div>
  );
}

export default MobileNavBarLinks;
