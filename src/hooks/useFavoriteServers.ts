import {useState} from "react";

export default function useFavoriteServers() {
    // TODO: load from file
    return useState<string[]>(["http://localhost:23000", "http://localhost:23004"]);
}