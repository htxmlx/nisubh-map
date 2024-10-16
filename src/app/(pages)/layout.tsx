import Nav from "@/components/nav";
import { PropsWithChildren } from "react";

export default function PagesLayout({ children }: PropsWithChildren) {
    return <Nav>{children}</Nav>;
}
