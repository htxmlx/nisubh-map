import Section from "@/components/ui/section";
import CreatePostForm from "@/features/posts/components/create-post";

export default function Page() {
    return (
        <Section>
            {/* <Protect
                fallback={<UnauthorizedPage />}
                permission="org:listing:create"
            > */}
            <CreatePostForm />
            {/* </Protect> */}
        </Section>
    );
}
