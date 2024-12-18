import { useQuery } from "@tanstack/react-query";
import { CloseTo } from "@prisma/client";
import { getPosts } from "../api/get-posts";

const usePosts = (
    limit: number = 50,
    filter?: CloseTo | undefined,
    approved?: boolean
) => {
    return useQuery({
        queryKey: [`posts-${CloseTo}`],
        queryFn: () => getPosts(limit, filter, approved),
        staleTime: 0,
    });
};

export { usePosts, getPosts };
