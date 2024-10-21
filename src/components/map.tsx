import StylesControl from "@mapbox-controls/styles";
import mapboxgl, { GeolocateControl, NavigationControl } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";

import { PostWithRating } from "@/features/posts/types";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";

import "@mapbox-controls/styles/src/index.css";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { CircleArrowOutUpRight, MapPin, Phone } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import Image from "next/image";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

interface MapProps {
    data: PostWithRating[];
}

export const MapboxMap = ({ data }: MapProps) => {
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const [selected, setSelected] = useState<PostWithRating | null>(null);

    useEffect(() => {
        mapboxgl.accessToken =
            "pk.eyJ1IjoiYXprcml2ZW4xNiIsImEiOiJjbGhma3IxaWcxN3c3M2VyM3VhcGsxcHk3In0.pto_0eshW9NHMP-m1O_blg";

        mapRef.current = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/standard",
            center: [123.14389088712784, 11.461424460015792],
            zoom: 13,
        });

        // Add controls
        const addControls = (map: mapboxgl.Map) => {
            map.addControl(new StylesControl({ compact: true }), "bottom-left");
            map.addControl(new NavigationControl(), "bottom-right");
            map.addControl(
                new GeolocateControl({
                    positionOptions: { enableHighAccuracy: true },
                    trackUserLocation: true,
                }),
                "bottom-left"
            );
        };

        addControls(mapRef.current);

        mapRef.current.on("click", () => {
            setSelected(null); // Deselect when clicking on the map
        });

        // Create markers for each property in the data
        data.forEach((item) => {
            const markerElement = document.createElement("div");
            markerElement.className =
                "aspect-video p-2 bg-primary rounded-full flex items-center justify-center z-10 text-white text-center text-xs"; // Tailwind classes

            // Create price text
            const priceText = document.createElement("span");
            priceText.textContent = `₱${item.price}`;
            markerElement.appendChild(priceText);

            markerElement.addEventListener("click", (e) => {
                e.stopPropagation(); // Prevent map click event
                setSelected(item); // Set selected item
            });

            new mapboxgl.Marker(markerElement)
                .setLngLat([item.longitude, item.latitude])
                .addTo(mapRef.current!);
        });

        return () => mapRef.current?.remove();
    }, [data]);

    return (
        <>
            <div id="map" style={{ height: "100%" }} />
            <Drawer open={!!selected} onOpenChange={() => setSelected(null)}>
                <DrawerContent>
                    <DrawerHeader className="space-y-2">
                        <DrawerTitle>{selected?.title}</DrawerTitle>
                        <DrawerDescription className="text-green-500 ">
                            {selected ? `₱${selected.price}` : ""}
                        </DrawerDescription>
                        <DrawerDescription>
                            <div className="flex gap-2">
                                <StarRating
                                    total={selected?.ratings?.length!}
                                    averageRating={selected?.averageRating!}
                                />
                                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                                    <MapPin className="size-3" />
                                    <span>{selected?.address}</span>
                                </div>
                            </div>
                        </DrawerDescription>
                        <div className="grid grid-cols-3 md:grid-cols-4 w-fit gap-2">
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${selected?.latitude},${selected?.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                    buttonVariants({ size: "sm" }),
                                    "gap-2"
                                )}
                            >
                                <CircleArrowOutUpRight className="size-4" />
                                Directions
                            </a>
                            <a
                                href={`tel:${selected?.owner_contact}`}
                                className={cn(
                                    buttonVariants({ size: "sm" }),
                                    "gap-2"
                                )}
                            >
                                <Phone /> Call
                            </a>
                            <Button
                                size="sm"
                                variant="outline"
                                className="gap-2"
                            >
                                {selected?.bathroom_no} Bathroom/s
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="gap-2"
                            >
                                {selected?.bedroom_no} Bedroom/s
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {selected?.images.map((data, idx) => (
                                <div
                                    key={idx}
                                    className="relative aspect-square rounded-xl overflow-hidden"
                                >
                                    <Image
                                        src={data}
                                        alt="Property Image"
                                        fill
                                    />
                                </div>
                            ))}
                        </div>
                        <DrawerClose />
                    </DrawerHeader>
                    <DrawerFooter>
                        <a
                            href={`/details?id=${selected?.id}`}
                            className={cn(
                                buttonVariants({ size: "sm" }),
                                "gap-2"
                            )}
                        >
                            More Details
                        </a>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};

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
