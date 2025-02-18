"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { SignInButton } from "@clerk/nextjs";

type FollowButtonProps = {
  userFromDataBase: User;
  apiRoute: string;
  isFollowable: boolean;
  currentClerkId: string | null;
};

function FollowButton({
  currentClerkId,
  userFromDataBase,
  isFollowable,
  apiRoute,
}: FollowButtonProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleFollow = async (clerkId: string) => {
    setLoading(true);

    try {
      const response = await fetch(`${apiRoute}/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          followerId: clerkId,
          followedId: currentClerkId,
        }),
      });
      const result = await response.json();
      if (!result.success) {
        console.error("Failed to follow user:", result.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
    router.refresh();
  };

  const handleUnFollow = async (clerkId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiRoute}/unfollow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          followerId: clerkId,
          followedId: currentClerkId,
        }),
      });
      const result = await response.json();
      if (!result.success) {
        console.error("Failed to follow user:", result.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
    router.refresh();
  };

  return (
    <div>
      {isFollowable ? (
        <Button
          onClick={() => handleFollow(userFromDataBase.clerkId)}
          size={"sm"}
          disabled={loading}
        >
          {!loading ? "Follow" : "Following..."}
        </Button>
      ) : (
        <>
          {!currentClerkId ? (
            <SignInButton
              fallbackRedirectUrl={
                new URLSearchParams(window.location.search).get(
                  "redirectUrl"
                ) || "/"
              }
            >
              <Button>Sign in to follow this user</Button>
            </SignInButton>
          ) : (
            <Button
              onClick={() => handleUnFollow(userFromDataBase.clerkId)}
              size={"sm"}
              disabled={loading}
            >
              {!loading ? "Unfollow" : "Unfollowing..."}
            </Button>
          )}
        </>
      )}
    </div>
  );
}

export default FollowButton;
