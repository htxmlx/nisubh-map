import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import RatingForm from "@/features/ratings/components/rating-form";

interface SearchParams {
    id?: string;
    action?: string;
    userId?: string;
}

export default async function ReviewPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const { id: postId, action, userId } = searchParams;

    if (!userId) {
        redirect("/sign-in");
    }

    if (!postId) {
        redirect("/");
    }

    // Handle delete action
    if (action === "delete") {
        try {
            await prisma.rating.delete({
                where: {
                    userId_postId: {
                        userId,
                        postId,
                    },
                },
            });
            redirect(`/details?id=${postId}`);
        } catch (error) {
            console.error("Error deleting rating:", error);
            throw error;
        }
    }

    // Get existing review if any
    const existingReview = await prisma.rating.findUnique({
        where: {
            userId_postId: {
                userId,
                postId,
            },
        },
    });

    return (
        <div className="container max-w-2xl py-10">
            <h1 className="font-semibold text-2xl mb-10 px-4">
                {existingReview ? "Edit your review" : "Write a review"}
            </h1>
            <RatingForm postId={postId} existingReview={existingReview} />
        </div>
    );
}
