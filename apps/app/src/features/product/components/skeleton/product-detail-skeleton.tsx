import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ProductDetailSkeleton() {
  return (
    <div className="px-4 py-8 mx-auto max-w-6xl w-full space-y-6">
      {/* Notion Cover Header Skeleton */}
      <div className="space-y-4">
        {/* Cover Banner Skeleton */}
        <div className="relative w-full h-56 sm:h-64 md:h-72 rounded-3xl overflow-hidden border bg-muted shadow-xs">
          <Skeleton className="w-full h-full rounded-3xl" />
          <div className="absolute top-4 left-4">
            <Skeleton className="size-10 rounded-full" />
          </div>
          <div className="absolute bottom-4 right-4">
            <Skeleton className="h-9 w-32 rounded-xl" />
          </div>
        </div>

        {/* Title & Metadata Bar Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 px-2 pt-1">
          <div className="flex items-center gap-4">
            {/* Overlapping Icon Avatar */}
            <Skeleton className="size-16 sm:size-20 rounded-2xl -mt-8 sm:-mt-10 border-4 border-background shadow-md shrink-0" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-56 rounded-lg" />
                <Skeleton className="h-6 w-20 rounded-md" />
              </div>
              <Skeleton className="h-4 w-72 rounded-md" />
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <Skeleton className="h-10 w-36 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Grid Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="rounded-3xl">
            <CardHeader className="space-y-2">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-24 w-full rounded-lg" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="pt-2 border-t space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-6 w-11 rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-6 w-11 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-52" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-36 w-full rounded-2xl" />
            </CardContent>
          </Card>
        </div>

        {/* Right Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-3xl">
            <CardHeader className="space-y-2">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-4 w-44" />
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
