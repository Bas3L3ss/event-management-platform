"use client";
import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { toastPrint } from "@/utils/toast action/action";
import { Button } from "./ui/button";

function EditBio({
  bioDataFromDB,
  clerkID,
}: {
  clerkID: string;
  bioDataFromDB: string | undefined;
}) {
  const [bioData, setBioData] = useState<string>(bioDataFromDB || "");
  const [textLength, setTextLength] = useState<number>(bioData?.length || 0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    if (bioData.length > maxLength) {
      return toastPrint(
        "warning",
        "Please keep your bio length in range",
        "destructive"
      );
    }
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkID: clerkID,
          bioData: bioData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toastPrint("success", "Bio updated successfully", "default");
      } else {
        toastPrint("error", "Failed to update bio", "destructive");
      }
    } catch (error) {
      console.log(error);

      toastPrint(
        "error",
        "An error occurred while updating bio",
        "destructive"
      );
    }
    setIsLoading(false);
  }
  useEffect(() => {
    setTextLength(bioData?.length || 0);
  }, [bioData?.length]);
  const maxLength = 500;
  return (
    <>
      <form onSubmit={handleSubmit} className="mb-10">
        <Label htmlFor="bio">Modify bio:</Label>
        <textarea
          name="bio"
          className="w-full p-2 mt-2"
          id="bio"
          value={bioData}
          onChange={(e) => {
            if (maxLength <= e.target.value.length - 1) {
              return toastPrint(
                "warning",
                "Please keep your bio length in range",
                "destructive"
              );
            }
            setBioData(e.target.value);
          }}
        />

        <p
          className={`${
            maxLength <= bioData.length ? "text-red-600" : "text-gray-600"
          }`}
        >
          {textLength}/{maxLength}
        </p>
        <Button disabled={isLoading} className="mt-2" type="submit">
          Modify
        </Button>
      </form>
    </>
  );
}

export default EditBio;
