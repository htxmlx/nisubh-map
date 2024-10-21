"use client";

import { MapboxMap } from "@/components/map";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import Section from "@/components/ui/section";
import { Slider } from "@/components/ui/slider";
import { usePosts } from "@/features/posts/hooks/use-posts";
import { Loader2, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

export default function Home() {
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(5000);

    const { data, isPending } = usePosts(undefined, undefined, true);

    if (isPending) {
        return (
            <Section className="flex items-center justify-center flex-col">
                <Loader2 className="size-10 animate-spin" />
                Please wait...
            </Section>
        );
    }

    const filteredData = data?.filter((item) => {
        const price = Number(item.price);
        return price >= minPrice && price <= maxPrice;
    });

    return (
        <div className="relative h-[84vh] md:h-[60vh] w-full overflow-hidden">
            <div className="absolute inset-x-2 top-4 z-50 flex gap-2 justify-end">
                <Drawer>
                    <DrawerTrigger asChild>
                        <Button className="gap-2" variant="secondary">
                            Filter Price{" "}
                            <SlidersHorizontal className="size-4" />
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Price Filter</DrawerTitle>
                            <div className="relative flex-1">
                                <div className="price-filter p-4 shadow-md rounded">
                                    <Slider
                                        min={0}
                                        max={5000}
                                        step={1000}
                                        value={[minPrice, maxPrice]}
                                        onValueChange={(value) => {
                                            setMinPrice(value[0]);
                                            setMaxPrice(value[1]);
                                        }}
                                        className="w-full min-w-[250px] mt-2"
                                    />
                                    <div className="flex justify-between mt-2 text-sm">
                                        <span>{`$${minPrice}`}</span>
                                        <span>{`$${maxPrice}`}</span>
                                    </div>
                                </div>
                            </div>
                        </DrawerHeader>
                        <DrawerFooter>
                            <DrawerClose>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </div>
            <MapboxMap data={filteredData!} />
        </div>
    );
}
