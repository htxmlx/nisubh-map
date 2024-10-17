import { Home, List, PlusCircle, Settings } from "lucide-react";
import Link from "next/link";
import { PropsWithChildren } from "react";
import Header from "./header";

export default function Nav({ children }: PropsWithChildren) {
    const menuItems = [
        { name: "Map", icon: Home, href: "/map" },
        { name: "Listing", icon: List, href: "/listing" },
        { name: "Create", icon: PlusCircle, href: "/create" },
        // { name: "Admin", icon: Settings, href: "/admin" },
    ];

    return (
        <div className="flex flex-col py-2">
            <Header />

            <div className="flex h-screen flex-col md:flex-row">
                {/* Sidebar for md and larger screens */}
                <aside className="hidden md:flex flex-col p-2">
                    <nav className="space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-200"
                            >
                                <item.icon className="h-5 w-5" />
                                {/* <span>{item.name}</span> */}
                            </Link>
                        ))}
                    </nav>
                </aside>

                {children}

                {/* Bottom navbar for smaller screens */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-100 p-2">
                    <ul className="flex justify-around z-50">
                        {menuItems.map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className="flex flex-col items-center p-2"
                                >
                                    <item.icon className="h-6 w-6" />
                                    <span className="text-xs mt-1">
                                        {item.name}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
}
