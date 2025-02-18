import React from "react";
import Container from "./Container";
import { Skeleton } from "./ui/skeleton";
import { LIMIT, LoadingVariant } from "@/constants/values";
import { Card, CardContent, CardHeader } from "./ui/card";

function SkeletonLoading({ variant }: { variant?: LoadingVariant }) {
  switch (variant) {
    case LoadingVariant.CARD:
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(LIMIT)].map((_, i) => (
            <div key={i} className="flex flex-col h-full">
              <div className="p-6 space-y-4">
                <Skeleton className="h-48 w-full" />

                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-16 w-full" />
                </div>

                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    case LoadingVariant.SEARCH:
      return (
        <div className="space-y-4 mt-5">
          <div className="flex gap-3">
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="flex flex-wrap gap-3 justify-between">
            <div className="flex gap-3 flex-wrap">
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-10 w-56" />
              </div>
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-10 w-56" />
              </div>
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
            <div className="ml-auto mt-auto gap-2 flex">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-6" />
            </div>
          </div>
        </div>
      );
    case LoadingVariant.FEATURED:
      return (
        <div className="relative overflow-hidden py-24 lg:py-32">
          <Container className="relative z-10">
            <div className="text-center my-8">
              <Skeleton className="h-8 w-80 mx-auto" />
            </div>

            {/* Grid of Featured Events */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-40 w-full rounded-md" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          </Container>
        </div>
      );
    case LoadingVariant.PROFILE:
      return (
        <div className="container mx-auto px-4 py-8">
          <Card className="mb-8 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-400/30 to-purple-500/30"></div>
            <CardContent className="relative pt-16 pb-8">
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                <Skeleton className="w-32 h-32 rounded-full" />
              </div>
              <div className="text-center mt-4">
                <Skeleton className="h-8 w-48 mx-auto mb-2" />
                <Skeleton className="h-9 w-32 mx-auto" />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-8 text-center">
                <div>
                  <Skeleton className="h-8 w-16 mx-auto mb-1" />
                  <Skeleton className="h-4 w-24 mx-auto" />
                </div>
                <div className="border-x border-border px-4">
                  <Skeleton className="h-8 w-16 mx-auto mb-1" />
                  <Skeleton className="h-4 w-24 mx-auto" />
                </div>
                <div>
                  <Skeleton className="h-8 w-16 mx-auto mb-1" />
                  <Skeleton className="h-4 w-24 mx-auto" />
                </div>
              </div>
              <div className="mt-8 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    case LoadingVariant.EDITPROFILE:
      return (
        <Container className="py-8 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-36" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid w-full grid-cols-2 gap-2">
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                </div>
                <div className="bg-background p-4 rounded-lg">
                  <div className="space-y-4">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Container>
      );
    case LoadingVariant.ORDER:
      return (
        <div className="space-y-4">
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-[180px]" />
          </div>
          <div>
            <div className="rounded-md border">
              <div className="border-b">
                <div className="grid grid-cols-8 px-4 py-3">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-b last:border-none">
                  <div className="grid grid-cols-8 items-center px-4 py-4">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-64" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>
      );
    case LoadingVariant.EVENTPAGE:
      return (
        <div className="mt-10">
          <article className="relative grid md:grid-cols-2 gap-8 xl:gap-12">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-sm flex items-center">
                  <Skeleton className="h-4 w-4 mr-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-12 w-full" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                  <span className="animate-pulse text-muted-foreground">•</span>
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-4" />
                  ))}
                </div>
                <Skeleton className="h-4 w-32" />
              </div>
            </div>

            <div className="space-y-4">
              <Skeleton className="h-[400px] w-full rounded-lg" />
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-lg" />
                ))}
              </div>
            </div>
          </article>
        </div>
      );
    case LoadingVariant.FORM:
      return (
        <Container className="mt-10 flex flex-col gap-6">
          <div className="flex items-center space-x-2">
            {[...Array(4)].map((_, i) => (
              <React.Fragment key={i}>
                <Skeleton className="h-4 w-20" />
                {i < 3 && (
                  <span className="animate-pulse text-muted-foreground">/</span>
                )}
              </React.Fragment>
            ))}
          </div>

          <Skeleton className="h-10 w-48" />

          <div className="border border-border p-8 rounded-lg shadow-sm bg-card">
            <div className="relative">
              <div className="absolute top-0 right-0">
                <Skeleton className="h-10 w-32" />
              </div>

              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 my-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-32 w-full" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <Skeleton className="h-6 w-24" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-[200px] w-full rounded-lg" />
                    <Skeleton className="h-[200px] w-full rounded-lg" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-5" />
                </div>

                <Skeleton className="h-10 w-full mt-8" />
              </div>
            </div>
          </div>
        </Container>
      );
    default:
      return (
        <Container className="mt-10">
          <Skeleton className="h-56 w-full" />
        </Container>
      );
  }
}

export default SkeletonLoading;
