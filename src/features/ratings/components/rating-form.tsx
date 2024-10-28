"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { StarFilledIcon } from "@radix-ui/react-icons";
import React from "react";
import { createRating } from "../api/create-rating";

const formSchema = z.object({
    value: z.number().min(1).max(5),
    review: z.string().min(10, "Review must be at least 10 characters"),
});

interface RatingFormProps {
    postId: string;
    existingReview?: {
        value: number;
        review: string;
    } | null;
}

export default function RatingForm({
    postId,
    existingReview,
}: RatingFormProps) {
    const router = useRouter();
    const { userId } = useAuth();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: existingReview?.value || 0,
            review: existingReview?.review || "",
        },
    });

    const [hoveredRating, setHoveredRating] = React.useState(0);
    const [selectedRating, setSelectedRating] = React.useState(
        existingReview?.value || 0
    );
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (!userId) {
                throw new Error("User must be logged in to create a rating");
            }
            await createRating(postId, selectedRating, values.review, userId);

            router.push(`/details?id=${postId}`);
        } catch (error) {
            console.error("Error submitting rating:", error);
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 px-4"
            >
                <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <Button
                                            key={rating}
                                            type="button"
                                            variant="ghost"
                                            className="p-0 h-auto"
                                            onMouseEnter={() =>
                                                setHoveredRating(rating)
                                            }
                                            onMouseLeave={() =>
                                                setHoveredRating(0)
                                            }
                                            onClick={() => {
                                                setSelectedRating(rating);
                                                field.onChange(rating);
                                            }}
                                        >
                                            <StarFilledIcon
                                                className={`h-8 w-8 ${
                                                    rating <=
                                                    (hoveredRating ||
                                                        selectedRating)
                                                        ? "text-yellow-400"
                                                        : "text-gray-300"
                                                }`}
                                            />
                                        </Button>
                                    ))}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="review"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    placeholder="Write your review here..."
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">
                    {existingReview ? "Update Review" : "Submit Review"}
                </Button>
            </form>
        </Form>
    );
}
