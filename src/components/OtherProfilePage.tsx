import Container from "@/components/Container";
import { User } from "@prisma/client";
import { Mail, Phone } from "lucide-react";
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

async function OtherProfilePage({
  eventLength,
  userFromDataBase,
  typeUserSubmitted,
}: {
  eventLength: number;
  userFromDataBase: User;
  typeUserSubmitted: string[];
}) {
  const currentClerkId = auth().userId;
  const isFollowAble = await isFollowable(
    userFromDataBase.clerkId,
    currentClerkId as string
  );

  return (
    <Container className="mt-10 flex flex-col gap-2">
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
      <div className="relative bg-secondary mt-5 rounded-md p-5">
        <div className="flex flex-col items-center">
          <Avatar>
            <AvatarImage
              src={userFromDataBase.userAvatar}
              alt={userFromDataBase.userName}
            />
            <AvatarFallback>
              {userFromDataBase.userName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="font-bold">{userFromDataBase.userName}</p>
          <div className="flex mt-2">
            <FollowButton
              apiRoute={"/api/profile/"}
              isFollowable={isFollowAble}
              userFromDataBase={userFromDataBase}
              currentClerkId={currentClerkId}
            />
          </div>
        </div>
        <article className="grid grid-cols-3 text-center mt-5">
          <div className="">
            <p>{eventLength}</p>
            <p className="text-slate-500 text-xs">Events Posted</p>
          </div>
          <div className="border-r-[1.5px] border-l-[1.5px] border-x-muted-foreground">
            <p>{userFromDataBase.followedByUsers.length}</p>

            <Link
              href={`/profile/followers/${userFromDataBase.clerkId}`}
              className="text-slate-500 text-xs"
            >
              Followers
            </Link>
          </div>
          <div>
            <p>{userFromDataBase.followers.length}</p>
            <Link
              href={`/profile/following/${userFromDataBase.clerkId}`}
              className="text-slate-500 text-xs"
            >
              Following
            </Link>
          </div>
        </article>

        <article className="mt-7">
          {userFromDataBase.userEmail && (
            <div className="flex gap-2 items-center">
              <Mail className="p-1" />
              <p className="text-xs">{userFromDataBase.userEmail}</p>
            </div>
          )}
          {userFromDataBase.userPhone && (
            <div className="flex gap-2 items-center">
              <Phone className="p-1" />
              <a
                href={`tel:+${userFromDataBase.userPhone}`}
                className="text-xs"
              >
                {userFromDataBase.userPhone}
              </a>
            </div>
          )}
        </article>
      </div>
      <article className="bg-secondary mt-5 rounded-md p-5">
        <p className="font-bold text-base mb-2">Biography</p>
        {userFromDataBase.userBiography === "" ? (
          <p className="text-sm text-slate-500">not yet.</p>
        ) : (
          <p>
            {userFromDataBase.userBiography.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
        )}
      </article>

      <article className="bg-secondary mt-5 rounded-md p-5">
        <p className="font-bold text-base mb-2">Latest Activities</p>
        {userFromDataBase.userBiography == "" ? (
          <p className="text-sm text-slate-500">not yet.</p>
        ) : (
          <p>{userFromDataBase.userBiography}</p>
        )}
      </article>
      <article className="bg-secondary mt-5 rounded-md p-5">
        <p className="font-bold text-base mb-2">Posted Events Types</p>
        {typeUserSubmitted.length > 0 ? (
          <ul className="flex gap-2 flex-wrap">
            {typeUserSubmitted.map((type) => {
              return (
                <li
                  key={type}
                  className=" bg-primary flex justify-center items-center   hover:!bg-blue-600 cursor-pointer px-3 rounded-3xl"
                >
                  <Badge key={type}>
                    <li className="  ">
                      <Link href={`/events?eventtype=${type}`}>
                        <span className="capitalize text-xs">
                          {type.toLowerCase().replace("_", " ")}
                        </span>
                      </Link>
                    </li>
                  </Badge>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">No events yet.</p>
        )}
      </article>
    </Container>
  );
}

export default OtherProfilePage;
