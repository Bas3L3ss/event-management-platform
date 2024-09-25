import Container from "@/components/Container";
import { Event, User } from "@prisma/client";
import { Mail, Phone, MapPin, Calendar, User as UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import FollowButton from "./FollowButton";
import { auth } from "@clerk/nextjs/server";
import { isFollowable } from "@/utils/actions/usersActions";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import TimeLineEvents from "./timeline/Timeline-v2";

export default async function OtherProfilePage({
  eventLength,
  userFromDataBase,
  typeUserSubmitted,
  eventUserSubmitted,
}: {
  eventLength: number;
  userFromDataBase: User;
  eventUserSubmitted: Event[];
  typeUserSubmitted: string[];
}) {
  const currentClerkId = auth().userId;
  const isFollowAble = await isFollowable(
    userFromDataBase.clerkId,
    currentClerkId as string
  );

  return (
    <Container className="mt-10 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/profile">Profile</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{userFromDataBase.userName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500"></div>
        <CardContent className="relative pt-16 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
            <Avatar className="w-32 h-32 border-4 border-background">
              <AvatarImage
                src={userFromDataBase.userAvatar}
                alt={userFromDataBase.userName}
              />
              <AvatarFallback className="text-2xl">
                {userFromDataBase.userName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center mt-4">
            <h2 className="text-2xl font-bold">{userFromDataBase.userName}</h2>
            <div className="mt-4">
              <FollowButton
                apiRoute={"/api/profile/"}
                isFollowable={isFollowAble}
                userFromDataBase={userFromDataBase}
                currentClerkId={currentClerkId}
              />
            </div>
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
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {userFromDataBase.userEmail && (
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{userFromDataBase.userEmail}</span>
              </div>
            )}
            {userFromDataBase.userPhone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`tel:+${userFromDataBase.userPhone}`}
                  className="text-sm hover:underline"
                >
                  {userFromDataBase.userPhone}
                </a>
              </div>
            )}
          </CardContent>
        </Card>

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
                No biography available.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
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
                      className="cursor-pointer hover:!bg-primary"
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
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Latest Activities</CardTitle>
          </CardHeader>
          <CardContent>
            {eventUserSubmitted.length > 0 ? (
              <div>
                <TimeLineEvents events={eventUserSubmitted} />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No recent activities.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
