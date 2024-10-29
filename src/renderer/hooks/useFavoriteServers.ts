import {useEffect, useState} from "react";

export default function useFavoriteServers(): [string[]|undefined, (newFavorites: string[]) => void] {
    const [favorites, setFavorites] = useState<string[]|undefined>(undefined);

    useEffect(() => {
        (async () => {
            const data = await window.electronAPI.getFavoriteServers();
            setFavorites(data);
        })();
    }, []);

    const handleSetFavorites = (newFavorites: string[]) => {
        (async () => {
            await window.electronAPI.saveFavoriteServers(newFavorites);
            const data = await window.electronAPI.getFavoriteServers();
            setFavorites(data);
        })();
    }
    
    return [favorites, handleSetFavorites];
}