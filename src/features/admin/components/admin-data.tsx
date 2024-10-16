"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePosts } from "@/features/posts/hooks/use-posts";
import { FileText, Users } from "lucide-react";

export default function AdminData({ userCount = 0 }: { userCount?: number }) {
    const { data: posts, isPending } = usePosts();

    if (isPending) {
        return (
            <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-[120px]" />
                <Skeleton className="h-[120px]" />
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Listings
                    </CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {posts?.length ?? 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {isPending ? "Updating..." : "Active listings"}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Registered Users
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{userCount}</div>
                    <p className="text-xs text-muted-foreground">
                        Total user accounts
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
