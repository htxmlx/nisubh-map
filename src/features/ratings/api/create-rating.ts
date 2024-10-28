"use server";

import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createRating(
    postId: string,
    rating: number,
    review: string,
    userId: string
) {
    if (!userId) {
        throw new Error("User must be logged in to create a rating");
    }

    const clerk = clerkClient();

    const { imageUrl, fullName } = await clerk.users.getUser(userId);

    try {
        // Check if user has already rated this post
        const existingRating = await prisma.rating.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId,
                },
            },
        });

        if (existingRating) {
            // Update existing rating instead of creating new one
            await prisma.rating.update({
                where: {
                    userId_postId: {
                        userId,
                        postId,
                    },
                },
                data: {
                    value: rating,
                    review,
                    user_image: imageUrl,
                    user_name: fullName || "Anonymous",
                },
            });
        } else {
            // Create new rating
            await prisma.rating.create({
                data: {
                    userId,
                    postId,
                    value: rating,
                    review,
                    user_image: imageUrl,
                    user_name: fullName || "Anonymous",
                },
            });
        }

        revalidatePath(`/details?id=${postId}`);
    } catch (error) {
        console.error("Error creating/updating rating:", error);
        throw new Error("Failed to create/update rating");
    }
}
