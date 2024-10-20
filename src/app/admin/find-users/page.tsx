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

    return (
        <>
            <SearchUsers />
            <UserTable users={users} />
        </>
    );
}
