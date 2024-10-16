import { StarFilledIcon } from "@radix-ui/react-icons";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { BathIcon, BedIcon, LocateIcon } from "lucide-react";
import Link from "next/link";
import { PostWithRating } from "../types";
import Image from "next/image";

export function PostCard({
    id,
    address,
    images,
    title,
    price,
    averageRating,
    ratings,
    bathroom_no,
    bedroom_no,
    close_to,
}: PostWithRating) {
    return (
        <Link href={`/details?id=${id}`} className="space-y-2">
            <Card className="p-2">
                <Carousel
                    opts={{
                        align: "start",
                    }}
                >
                    <CarouselContent>
                        {images.length &&
                            images.map((img) => (
                                <CarouselItem className="basis-2/5">
                                    <div className="relative aspect-video">
                                        <Image
                                            src={img}
                                            alt={title}
                                            fill
                                            className="aspect-video object-cover rounded-lg"
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>

                <h1 className="text-sm">{title}</h1>
                <div className="flex gap-2">
                    <StarRating
                        total={ratings?.length}
                        averageRating={averageRating}
                    />
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <LocateIcon className="size-3" />
                        <span>{address}</span>
                    </div>
                </div>
                <p className="text-xs text-green-500">₱ {price}</p>
                <div className="flex gap-2 ">
                    {bathroom_no && (
                        <Badge
                            variant="outline"
                            className="space-x-1 text-xs font-normal"
                        >
                            <BathIcon className="size-3" />
                            <span>{bathroom_no} Bathroom</span>
                        </Badge>
                    )}

                    {bedroom_no && (
                        <Badge
                            variant="outline"
                            className="space-x-1 text-xs font-normal"
                        >
                            <BedIcon className="size-3" />
                            <span>{bedroom_no} Bathroom</span>
                        </Badge>
                    )}
                </div>
            </Card>
        </Link>
    );
}

interface StarRatingProps {
    averageRating: number | null;
    total: number;
}

function StarRating({ averageRating, total }: StarRatingProps) {
    const starCount = averageRating !== null ? Math.floor(averageRating) : 0;

    return (
        <div className="flex items-center font-normal gap-0.5">
            <span className="text-xs">{starCount}.0</span>
            {[...Array(5)].map((_, index) => (
                <span key={index}>
                    {index < starCount ? (
                        <StarFilledIcon className="text-yellow-500" />
                    ) : (
                        <StarFilledIcon className="text-gray-300" />
                    )}{" "}
                </span>
            ))}
            <span className="text-xs">({total})</span>
        </div>
    );
}
