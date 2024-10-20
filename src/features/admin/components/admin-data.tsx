"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePosts } from "@/features/posts/hooks/use-posts";
import { FileText, Users } from "lucide-react";
import {
    Bar,
    BarChart,
    Pie,
    PieChart,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from "recharts";

export default function AdminData({ userCount = 0 }: { userCount?: number }) {
    const { data: posts, isPending } = usePosts();

    if (isPending) {
        return <Skeleton className="h-[300px]" />;
    }

    const approvedPosts = posts?.filter((post) => post.approved === true) || [];
    const unapprovedPosts =
        posts?.filter((post) => post.approved === false) || [];

    const listingsData = [
        { name: "Total", value: posts?.length ?? 0 },
        { name: "Approved", value: approvedPosts.length },
        { name: "Unapproved", value: unapprovedPosts.length },
    ];

    const userData = [
        { name: "Users", value: userCount },
        { name: "Non-Users", value: 100 - userCount }, // Assuming 100 is the maximum for this example
    ];

    const colors = [
        "hsl(252, 78%, 60%)", // Purple for Total
        "hsl(142, 76%, 36%)", // Green for Approved
        "hsl(0, 84%, 60%)", // Red for Unapproved
        "hsl(200, 95%, 53%)", // Blue for Regular Users
        "hsl(25, 95%, 53%)", // Orange for Admins
    ];
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Listings Overview
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={listingsData}>
                        <Bar
                            dataKey="value"
                            fill="hsl(var(--primary))"
                            radius={[4, 4, 0, 0]}
                        >
                            {listingsData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={colors[index % colors.length]}
                                />
                            ))}
                        </Bar>
                        <Tooltip />
                        <Legend />
                    </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                    {listingsData.map((entry, index) => (
                        <div
                            key={entry.name}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center">
                                <div
                                    className="w-3 h-3 mr-2"
                                    style={{
                                        backgroundColor:
                                            colors[index % colors.length],
                                    }}
                                />
                                <span className="text-sm">{entry.name}</span>
                            </div>
                            <span className="font-bold">{entry.value}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
