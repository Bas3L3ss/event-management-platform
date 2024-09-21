"use client";
import Container from "@/components/Container";
import { useSession, useUser } from "@clerk/nextjs";
import { EventType, User } from "@prisma/client";
import { Edit, Edit2Icon, Mail, Phone } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import React from "react";

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

  // const { theme } = useTheme();

  if (!user || !session) return null;

  return (
    <Container>
      <div className="relative bg-secondary mt-5 rounded-md p-5">
        <Link href={"/profile/profileedit"}>
          <span className="absolute right-10 top-5 hover:!text-primary cursor-pointer ">
            <Edit />
          </span>
        </Link>
        <div className="flex flex-col items-center">
          <Image
            alt={`${user.fullName}`}
            src={`${user.imageUrl} `}
            width={50}
            className="rounded-full"
            height={50}
          ></Image>
          <p className="font-bold">{user.username}</p>
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
                  <Link href={`/events?eventtype=${type}`}>
                    <span className="capitalize text-xs">
                      {type.toLowerCase().replace("_", " ")}
                    </span>
                  </Link>
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

export default UserProfilePage;
