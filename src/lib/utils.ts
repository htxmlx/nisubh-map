import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatPrice = (price: number): string => {
    if (price >= 1_000_000) {
        return `${(price / 1_000_000).toFixed(1)}M`;
    }
    if (price >= 1_000) {
        return `${(price / 1_000).toFixed(1)}k`;
    }
    return price.toString();
};

export async function isValidPassword(
    password: string,
    hashedPassword: string
) {
    console.log(hashedPassword);
    return (await hashPassword(password)) === hashedPassword;
}

async function hashPassword(password: string) {
    const arrayBuffer = await crypto.subtle.digest(
        "SHA-512",
        new TextEncoder().encode(password)
    );

    return Buffer.from(arrayBuffer).toString("base64");
}
