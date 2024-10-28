"use client";

import { Button } from "@/components/ui/button";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

interface UserReviewButtonProps {
    postId: string;
    userId?: string;
    hasReviewed?: boolean;
}

export default function UserReviewButton({
    postId,
    userId,
    hasReviewed = false,
}: UserReviewButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        if (!userId) {
            router.push("/sign-in");
            return;
        }

        if (hasReviewed) {
            router.push(`/review?id=${postId}&action=delete&userId=${userId}`);
        } else {
            router.push(`/review?id=${postId}&userId=${userId}`);
        }
    };

    return (
        <Button
            onClick={handleClick}
            variant={hasReviewed ? "destructive" : "default"}
            className="gap-2"  
        >
            <StarFilledIcon className="size-4" />
            {hasReviewed ? "Delete Review" : "Write a Review"}
        </Button>
    );
}
