"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function setDelete(id: string) {
    try {
        const post = await prisma.post.findUnique({
            where: {
                id,
            },
        });

        if (post) {
            await prisma.post.delete({
                where: { id },
            });
            revalidatePath("/admin/approved");
            revalidatePath("/admin/unapproved");
        }
    } catch (error) {
        console.error("Error fetching or deleting post:", error);
        return null;
    }
}
