"use client";

import { User } from "@prisma/client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Title from "./Title";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import Link from "next/link";

type UserFollowerOrFollowingDisplayProps = {
  UserData: User[];
  username?: string;
  isFollowerPage?: boolean;
};

const hasWeirdSymbols = (name: string): boolean => {
  return !/^[a-zA-Z0-9\s]+$/.test(name);
};

const sortUsers = (users: User[]): User[] => {
  return users.sort((a, b) => {
    // First, sort by authorized status
    if (a.isAuthorizedUser !== b.isAuthorizedUser) {
      return a.isAuthorizedUser ? -1 : 1;
    }

    // Then, check for weird symbols
    const aWeird = hasWeirdSymbols(a.userName);
    const bWeird = hasWeirdSymbols(b.userName);
    if (aWeird !== bWeird) {
      return aWeird ? 1 : -1;
    }

    // Finally, sort alphabetically
    return a.userName.localeCompare(b.userName);
  });
};

function UserFollowerOrFollowingDisplay({
  UserData,
  username,
  isFollowerPage = false,
}: UserFollowerOrFollowingDisplayProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showAuthorizedOnly, setShowAuthorizedOnly] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!UserData || UserData.length === 0) {
    return (
      <p className="text-center py-10 text-muted-foreground">
        {isFollowerPage
          ? "This user doesn't follow anyone"
          : "No one follows this user"}
      </p>
    );
  }

  const filteredUsers = sortUsers(UserData).filter(
    (user) =>
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!showAuthorizedOnly || user.isAuthorizedUser)
  );

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Title
        className="mb-2 md:mb-5"
        title={`${
          isFollowerPage
            ? `${username}'s Follower Lists: ${UserData.length} follower(s)`
            : `${username}'s Following Lists: ${UserData.length} following user(s)`
        }`}
      />
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center space-x-2">
          <Checkbox
            id="authorized"
            checked={showAuthorizedOnly}
            onCheckedChange={(checked) =>
              setShowAuthorizedOnly(checked as boolean)
            }
          />
          <label
            htmlFor="authorized"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Show authorized users only
          </label>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar>
                <AvatarImage src={user.userAvatar} alt={user.userName} />
                <AvatarFallback>
                  {user.userName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <CardTitle className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Link
                          className="hover:!text-primary "
                          href={`/profile/${user.clerkId}`}
                        >
                          <span className="truncate">{user.userName}</span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Review profile</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {user.isAuthorizedUser && (
                    <Badge variant="secondary" className="ml-2">
                      Authorized
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-sm text-muted-foreground truncate">
                  {user.userEmail}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Joined: {new Date(user.accountCreatedAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default UserFollowerOrFollowingDisplay;
