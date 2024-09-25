"use client";

import { useSession, useUser } from "@clerk/nextjs";
import { User } from "@prisma/client";
import {
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User as UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

function UserProfilePage({
  eventLength,
  userFromDataBase,
  typeUserSubmitted,
}: {
  eventLength: number;
  userFromDataBase: User;
  typeUserSubmitted: string[];
}) {
  const { user } = useUser();
  const { session } = useSession();

  if (!user || !session) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500"></div>
        <CardContent className="relative pt-16 pb-8">
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
            <Avatar className="w-32 h-32 border-4 border-background">
              <AvatarImage
                src={user.imageUrl}
                alt={userFromDataBase.userName}
              />
              <AvatarFallback>
                {userFromDataBase.userName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center mt-4">
            <h2 className="text-2xl font-bold">{user.username}</h2>
            <Link href="/profile/profileedit" className="inline-block mt-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-8 text-center">
            <div>
              <p className="text-2xl font-semibold">{eventLength}</p>
              <p className="text-sm text-muted-foreground">Events Posted</p>
            </div>
            <div className="border-x border-border px-4">
              <p className="text-2xl font-semibold">
                {userFromDataBase.followedByUsers.length}
              </p>
              <Link
                href={`/profile/followers/${userFromDataBase.clerkId}`}
                className="text-sm text-muted-foreground hover:underline"
              >
                Followers
              </Link>
            </div>
            <div>
              <p className="text-2xl font-semibold">
                {userFromDataBase.followers.length}
              </p>
              <Link
                href={`/profile/following/${userFromDataBase.clerkId}`}
                className="text-sm text-muted-foreground hover:underline"
              >
                Following
              </Link>
            </div>
          </div>
          <div className="mt-8 space-y-2">
            {userFromDataBase.userEmail && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm">{userFromDataBase.userEmail}</p>
              </div>
            )}
            {userFromDataBase.userPhone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <a
                  href={`tel:+${userFromDataBase.userPhone}`}
                  className="text-sm hover:underline"
                >
                  {userFromDataBase.userPhone}
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Biography</CardTitle>
          </CardHeader>
          <CardContent>
            {userFromDataBase.userBiography ? (
              <p className="text-sm">
                {userFromDataBase.userBiography
                  .split("\n")
                  .map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                No biography available yet.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Activities</CardTitle>
          </CardHeader>
          <CardContent>
            {userFromDataBase.userBiography ? (
              <p className="text-sm">{userFromDataBase.userBiography}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                No recent activities.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Posted Event Types</CardTitle>
          </CardHeader>
          <CardContent>
            {typeUserSubmitted.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {typeUserSubmitted.map((type) => (
                  <Link key={type} href={`/events?eventtype=${type}`}>
                    <Badge
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary-hover"
                    >
                      <span className="capitalize text-xs">
                        {type.toLowerCase().replace("_", " ")}
                      </span>
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No events posted yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default UserProfilePage;
