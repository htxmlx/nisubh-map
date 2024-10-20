import AdminData from "@/features/admin/components/admin-data";
import AdminNav from "@/features/admin/components/navbar";
import { clerkClient } from "@clerk/nextjs/server";
import React, { PropsWithChildren } from "react";

export default async function AdminLayout({ children }: PropsWithChildren) {
    const userCount = await (
        await clerkClient().users.getUserList()
    ).totalCount;

    return (
        <>
            <AdminNav />
            <AdminData userCount={userCount} />

            {children}
        </>
    );
}
