import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Section from "@/components/ui/section";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { setRole } from "@/features/admin/api/set-role";
import AdminData from "@/features/admin/components/admin-data";
import { SearchUsers } from "@/features/admin/components/search-user";
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
        <Section>
            <AdminData userCount={userCount} />
            <SearchUsers />

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead colSpan={2}>Set Role</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell className="col-span-full">
                                No users found
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    {user.firstName} {user.lastName}
                                </TableCell>
                                <TableCell>
                                    {
                                        user.emailAddresses.find(
                                            (email) =>
                                                email.id ===
                                                user.primaryEmailAddressId
                                        )?.emailAddress
                                    }
                                </TableCell>
                                <TableCell>
                                    {user.publicMetadata.role as string}
                                </TableCell>
                                <TableCell>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button>Change</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Change user role
                                                </DialogTitle>
                                                <DialogDescription>
                                                    This will affect user
                                                    permission and roles
                                                </DialogDescription>
                                            </DialogHeader>
                                            <form action={setRole}>
                                                <input
                                                    type="hidden"
                                                    value={user.id}
                                                    name="id"
                                                />
                                                <input
                                                    type="hidden"
                                                    value="tenant"
                                                    name="role"
                                                />
                                                <Button
                                                    variant="outline"
                                                    type="submit"
                                                >
                                                    Tenant
                                                </Button>
                                            </form>
                                            <form action={setRole}>
                                                <input
                                                    type="hidden"
                                                    value={user.id}
                                                    name="id"
                                                />
                                                <input
                                                    type="hidden"
                                                    value="landlord"
                                                    name="role"
                                                />
                                                <Button
                                                    variant="outline"
                                                    type="submit"
                                                >
                                                    Landlord
                                                </Button>
                                            </form>
                                            <DialogFooter>
                                                <Button type="submit">
                                                    Done
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </Section>
    );
}
