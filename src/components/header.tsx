"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { User2 } from "lucide-react";
import Link from "next/link";
import { PiMapPinAreaBold } from "react-icons/pi";
import { buttonVariants } from "./ui/button";

export default function Header() {
    return (
        <div className="py-3 px-2 z-50 bg-background rounded-xl flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
                <PiMapPinAreaBold className="fill-purple-500 size-10" />
                <p>
                    Nisu
                    <span className="font-bold">Map</span>
                </p>
            </Link>
            <SignedOut>
                <Link
                    className={buttonVariants({
                        variant: "ghost",
                        size: "icon",
                    })}
                    href="/sign-in"
                >
                    <User2 className="size-5" />
                    <span className="sr-only">User profile</span>
                </Link>
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </div>
    );
}
