import { useMutation } from "@tanstack/react-query";
import { setDelete } from "../api/set-delete";

const useDelete = () => {
    return useMutation({
        mutationFn: (id: string) => setDelete(id),
    });
};

export { setDelete, useDelete };
