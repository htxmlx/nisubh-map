"use client";

import Section from "@/components/ui/section";
import CreatePostForm from "@/features/posts/components/create-post";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import UnauthorizedPage from "../../../components/unauthorized";

export default function Page() {
    const { isSignedIn, orgRole, orgSlug } = useAuth();

    if (!isSignedIn) {
        redirect("/sign-in");
    }
    if (orgRole === "org:tenant") {
        return <UnauthorizedPage />;
    }

    console.log(orgRole, orgSlug);

    return (
        <Section>
            <CreatePostForm />
        </Section>
    );
}
