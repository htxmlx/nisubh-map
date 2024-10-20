"use server";

import prisma from "@/lib/prisma";
import { Post, CloseTo, Rating } from "@prisma/client";
import { PostWithRating } from "../types";

export async function getPosts(
    limit = 10,
    closeTo?: CloseTo,
    approved?: boolean
): Promise<PostWithRating[]> {
    try {
        const posts = await prisma.post.findMany({
            take: limit,
            where: {
                ...(closeTo && { close_to: closeTo }),
            },
            include: {
                ratings: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Calculate average ratings for each post
        const postsWithAverageRating = posts.map((post) => {
            const totalRating = post.ratings.reduce(
                (acc, rating) => acc + rating.value,
                0
            );
            const averageRating =
                post.ratings.length > 0
                    ? totalRating / post.ratings.length
                    : null;
            return {
                ...post,
                averageRating,
            };
        });

        return postsWithAverageRating as PostWithRating[];
    } catch (error) {
        console.error("Error fetching posts:", error);
        return []; // Return an empty array in case of error
    }
}
