"use client";

import { MapboxMap } from "@/components/map";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePosts } from "@/features/posts/hooks/use-posts";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BsHouseFill } from "react-icons/bs";
import { HiMiniUserCircle } from "react-icons/hi2";
import { IoMdPhotos } from "react-icons/io";
import { IoDownloadOutline } from "react-icons/io5";
import { FaMapMarkedAlt } from "react-icons/fa";
import Section from "@/components/ui/section";
import { Skeleton } from "@/components/ui/skeleton";
import { CloseTo } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PostCard } from "@/features/posts/components/post-card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function LandingPage() {
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(5000);
    const [closeToFilter, setCloseToFilter] = useState<CloseTo | undefined>(
        undefined
    );
    const [searchTerm, setSearchTerm] = useState("");

    const { data, isPending, isFetching } = usePosts(50, closeToFilter);

    const filteredData = data?.filter((item) => {
        const price = Number(item.price);
        return price >= minPrice && price <= maxPrice;
    });

    const filterOptions = [
        { label: "All", value: undefined },
        { label: "Main", value: CloseTo.main },
        { label: "West", value: CloseTo.west },
        { label: "Both Campus", value: CloseTo.both },
    ];

    function handleFilterClick(value: CloseTo | undefined) {
        setCloseToFilter(value);
    }

    // Filter the data based on the search term
    const filteredPosts = data?.filter(
        (post) =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (closeToFilter === undefined || post.close_to === closeToFilter)
    );

    if (isPending)
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

    return (
        <div className="grid md:grid-cols-2 w-full gap-10 md:p-5">
            <section className="space-y-10 hidden md:block">
                <div className="flex gap-2 mb-5">
                    {filterOptions.map((option) => (
                        <Badge
                            key={option.label}
                            onClick={() => handleFilterClick(option.value)}
                            className="cursor-pointer px-4 py-2"
                            variant={
                                closeToFilter === option.value
                                    ? "default"
                                    : "secondary"
                            }
                        >
                            {option.label}
                        </Badge>
                    ))}
                </div>

                <Input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <ScrollArea className="h-full md:h-80 w-full">
                    <ul className="space-y-2 w-full">
                        {filteredPosts!.map((post) => (
                            <li key={post.id}>
                                <PostCard {...post} />
                            </li>
                        ))}
                    </ul>
                </ScrollArea>
            </section>
            <section className="md:rounded-md overflow-hidden h-[85vh] md:h-[30rem]">
                <MapboxMap data={filteredData!} />
            </section>
        </div>
    );
}
