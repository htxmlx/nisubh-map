import { useMutation } from "@tanstack/react-query";
import { setApproved } from "../api/set-approved";

const useApproved = () => {
    return useMutation({
        mutationFn: (id: string) => setApproved(id),
    });
};

export { setApproved, useApproved };
