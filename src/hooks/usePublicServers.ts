import {useState} from "react";

export default function usePublicServers() {
    // TODO: pull from public server list
    const [publicServers] = useState<string[]>(["http://localhost:23000", "http://localhost:23001", "http://localhost:23002", "http://localhost:23003"]);

    return publicServers;
}