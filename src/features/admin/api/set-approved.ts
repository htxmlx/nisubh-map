"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function setApproved(id: string) {
    try {
        const post = await prisma.post.findUnique({
            where: {
                id,
            },
        });

        if (post) {
            const newApprovedStatus = !post.approved;

            await prisma.post.update({
                where: { id },
                data: { approved: newApprovedStatus },
            });
            revalidatePath("/admin/approved");
            revalidatePath("/admin/unapproved");
        }
    } catch (error) {
        console.error("Error fetching or updating post:", error);
        return null;
    }
}
