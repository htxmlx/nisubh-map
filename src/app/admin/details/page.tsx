"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Section from "@/components/ui/section";
import { Skeleton } from "@/components/ui/skeleton";
import { useApproved } from "@/features/admin/hooks/use-approved";
import { useDelete } from "@/features/admin/hooks/use-delete";
import { usePost } from "@/features/posts/hooks/use-post";
import {
    BathIcon,
    BedIcon,
    Droplets,
    Loader2,
    LocateIcon,
    WifiIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function AdminDetails({
    searchParams,
}: {
    searchParams?: { id: string };
}) {
    const router = useRouter();
    const { mutate } = useApproved();
    const { mutate: deletePost } = useDelete();
    const { data: listing, isPending } = usePost(searchParams?.id!);

    if (isPending) {
        return (
            <Section>
                <div className="flex gap-2">
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                </div>
                {Array.from({ length: 10 }).map((_, index) => (
                    <div key={index} className="flex flex-col space-y-3">
                        <Skeleton className="h-[125px] w-full max-w-sm rounded-xl" />
                    </div>
                ))}
            </Section>
        );
    }

    if (!listing) {
        return <Section>No listing found.</Section>;
    }

    const handleApprove = () => {
        try {
            mutate(searchParams?.id!);
            toast.success("Success");
            router.push("/admin");
        } catch (error) {
            toast.error("Error");
        }
    };

    const handleDelete = () => {
        try {
            deletePost(searchParams?.id!);
            toast.success("Success");
            router.push("/admin");
        } catch (error) {
            toast.error("Error");
        }
    };
    return (
        <div>
            <Section className="gap-5 flex flex-col justify-between">
                <div className="grid gap-4">
                    <Carousel className="rounded-xl overflow-hidden">
                        <CarouselContent>
                            {listing.images.map((item, key) => (
                                <CarouselItem
                                    key={key}
                                    className="md:basis-1/2 lg:basis-1/3"
                                >
                                    <Image
                                        src={item || "/placeholder.svg"}
                                        width={1200}
                                        height={600}
                                        alt="Listing Image"
                                        className="object-cover w-full aspect-[2/1]"
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>

                <div className="grid gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold">{listing.title}</h1>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <LocateIcon className="w-5 h-5" />
                            <span>{listing.address}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Avatar className="border w-11 h-11">
                            <AvatarImage
                                src={
                                    listing.owner_image ||
                                    "/placeholder-user.jpg"
                                }
                                alt="Host"
                            />
                            <AvatarFallback>
                                {listing.owner_name}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                            <div className="font-semibold">
                                Hosted by {`${listing.owner_name}`}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Owner Contact &middot;{" "}
                                {`${listing.owner_contact}`}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4">
                    <h2 className="text-2xl font-bold">
                        This property is close to
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <span>{listing.close_to.toUpperCase()} Campus</span>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4">
                    <h2 className="text-2xl font-bold">
                        What this place offers
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <BedIcon className="w-5 h-5" />
                            <span>{listing.bedroom_no} Bedroom</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <BathIcon className="w-5 h-5" />
                            <span>{listing.bathroom_no} Bathroom</span>
                        </div>

                        {listing.watersupply_available && (
                            <div className="flex items-center gap-2">
                                <Droplets className="w-5 h-5" />
                                <span>Water Supply</span>
                            </div>
                        )}

                        {listing.wifi_available && (
                            <div className="flex items-center gap-2">
                                <WifiIcon className="w-5 h-5" />
                                <span>Wifi</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button onClick={handleApprove}>
                        {listing?.approved ? "Unapprove" : "Approve"}
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        Delete
                    </Button>
                </div>
            </Section>
        </div>
    );
}
