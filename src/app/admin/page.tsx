import Section from "@/components/ui/section";
import AdminData from "@/features/admin/components/admin-data";
import { SearchUsers } from "@/features/admin/components/search-user";
import UserTable from "@/features/admin/components/user-table";
import { clerkClient } from "@clerk/nextjs/server";

export default async function AdminDashboard(params: {
    searchParams: { search?: string };
}) {
    const query = params.searchParams.search;

    const users = query
        ? (await clerkClient().users.getUserList({ query })).data
        : [];

    const userCount = await (
        await clerkClient().users.getUserList()
    ).totalCount;

    return (
        <>
            <AdminData userCount={userCount} />
            <SearchUsers />
            <UserTable users={users} />
        </>
    );
}
