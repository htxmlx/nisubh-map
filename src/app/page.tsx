"use client";

import { MapboxMap } from "@/components/map";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePosts } from "@/features/posts/hooks/use-posts";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsHouseFill } from "react-icons/bs";
import { HiMiniUserCircle } from "react-icons/hi2";
import { IoMdPhotos } from "react-icons/io";
import { IoDownloadOutline } from "react-icons/io5";
import { FaMapMarkedAlt } from "react-icons/fa";
import Section from "@/components/ui/section";

interface BeforeInstallPromptEvent extends Event {
    // Properties of the event
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: string; platform: string }>;
}

export default function LandingPage() {
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(5000);
    const { data, isPending } = usePosts();

    const [supportsPWA, setSupportsPWA] = useState<boolean>(false);
    const [promptInstall, setPromptInstall] =
        useState<BeforeInstallPromptEvent | null>(null);

    useEffect(() => {
        const handler = (e: BeforeInstallPromptEvent) => {
            e.preventDefault();
            console.log("we are being triggered :D");
            setSupportsPWA(true);
            setPromptInstall(e);
        };
        window.addEventListener("beforeinstallprompt", handler as any); // Cast to any if TypeScript complains

        return () =>
            window.removeEventListener("beforeinstallprompt", handler as any);
    }, []);

    const onClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
        evt.preventDefault();
        if (!promptInstall) {
            return;
        }
        promptInstall.prompt();
    };

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
        <div className="grid md:grid-cols-2 w-full gap-10 p-5">
            <section className="space-y-10">
                <nav className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <FaMapMarkedAlt className="fill-purple-500 size-10" />
                        <p>
                            Nisu
                            <span className="font-bold">Map</span>
                        </p>
                    </Link>

                    <Button className="bg-purple-500 text-purple-500-foreground shadow hover:bg-purple-500/90 text-white">
                        Sign In
                    </Button>
                </nav>
                <h1 className="text-5xl font-semibold">
                    Find the Best Places To <br />
                    <span className="text-purple-500">Board</span>
                </h1>
                <p>
                    With this Map, You can easily Find All the Places to be your
                    potential Home and be Informed Of Their Details Such as
                    Photos, Condition And their Costs.
                </p>

                <div className="space-y-5">
                    <h3>
                        Download App for <span className="font-bold">FREE</span>
                    </h3>
                    <div className="flex gap-5">
                        <Button className="gap-2" onClick={onClick}>
                            <IoDownloadOutline className="size-5" /> Download
                            App
                        </Button>
                        <Button variant="outline">See Platform</Button>
                    </div>
                </div>

                <div className="flex bg-secondary text-secondary-foreground justify-between rounded-md p-4 border">
                    <div className="flex items-center gap-2">
                        <BsHouseFill className="size-6" />
                        <div>
                            <p className="font-semibold text-lg">25,000</p>
                            <p>Places</p>
                        </div>
                    </div>
                    <Separator orientation="vertical" />
                    <div className="flex items-center gap-2">
                        <HiMiniUserCircle className="size-6" />
                        <div>
                            <p className="font-semibold text-lg">2000</p>
                            <p>Users</p>
                        </div>
                    </div>
                    <Separator orientation="vertical" />
                    <div className="flex items-center gap-2">
                        <IoMdPhotos className="size-6" />
                        <div>
                            <p className="font-semibold text-lg">10,000</p>
                            <p>Photos</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="rounded-md overflow-hidden h-96 md:h-auto">
                <MapboxMap data={filteredData ?? []} />
            </section>
        </div>
    );
}
