"use client";
import Container from "@/components/Container";
import { useOrganization, useSession, useUser } from "@clerk/nextjs";
import { User } from "@prisma/client";
import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";

function UserProfilePage({
  eventLength,
  userFromDataBase,
}: {
  eventLength: number;
  userFromDataBase: User;
}) {
  const { user } = useUser();
  const { session } = useSession();

  const { theme } = useTheme();

  if (!user || !session) return null;

  return (
    <Container>
      <div className="bg-secondary mt-5 rounded-md p-5">
        <div className="flex flex-col items-center">
          <Image
            alt={`${user.fullName}`}
            src={`${user.imageUrl} `}
            width={50}
            className="rounded-full"
            height={50}
          ></Image>
          <p>{user.fullName}</p>
        </div>
        <article className="grid grid-cols-3 text-center mt-5">
          <div className="">
            <p>{eventLength}</p>
            <p className="text-slate-500 text-xs">Events Posted</p>
          </div>
          <div className="border-r-[1.5px] border-l-[1.5px] border-x-muted-foreground">
            <p>{userFromDataBase.followers.length}</p>
            <p className="text-slate-500 text-xs">Followers</p>
          </div>
          <div>
            <p>{userFromDataBase.followedByUsers.length}</p>
            <p className="text-slate-500 text-xs">Followed by</p>
          </div>
        </article>
      </div>
    </Container>
  );
}

export default UserProfilePage;
