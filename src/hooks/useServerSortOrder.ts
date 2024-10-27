import {ServerSortOrder} from "../components/ServerSearch";
import {useState} from "react";

const localStorageKey = "server-sort-order";

export default function useServerSortOrder(fallback: ServerSortOrder): [ServerSortOrder, (s: ServerSortOrder) => void] {
    const localSortBy = localStorage.getItem(localStorageKey) as ServerSortOrder;
    const [sortBy, setSortBy] = useState<ServerSortOrder>(localSortBy ?? fallback);

    const handleChange = (s: ServerSortOrder) => {
        localStorage.setItem(localStorageKey, s);
        setSortBy(s);
    }

    return [sortBy, handleChange];
}