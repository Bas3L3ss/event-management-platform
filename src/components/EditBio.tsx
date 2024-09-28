"use client";

import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { toastPrint } from "@/utils/toast action/action";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Loader2 } from "lucide-react";

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
  const maxLength = 500;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    if (bioData.length > maxLength) {
      toastPrint(
        "warning",
        "Please keep your bio length in range",
        "destructive"
      );
      setIsLoading(false);
      return;
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
        await response.json();
        toastPrint("success", "Bio updated successfully", "default");
      } else {
        toastPrint("error", "Failed to update bio", "destructive");
      }
    } catch (error) {
      console.error(error);
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Modify Your Bio</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium">
              Your Bio:
            </Label>
            <Textarea
              name="bio"
              id="bio"
              value={bioData}
              onChange={(e) => {
                if (e.target.value.length <= maxLength) {
                  setBioData(e.target.value);
                } else {
                  toastPrint(
                    "warning",
                    "Please keep your bio length in range",
                    "destructive"
                  );
                }
              }}
              className="min-h-[150px] resize-none"
              placeholder="Tell us about yourself..."
            />
            <div className="flex justify-end">
              <p
                className={`text-sm ${
                  textLength > maxLength
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {textLength}/{maxLength}
              </p>
            </div>
          </div>
          <Button
            disabled={isLoading || textLength > maxLength}
            type="submit"
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Bio"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default EditBio;
