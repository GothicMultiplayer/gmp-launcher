import {useEffect, useState} from "react";

export default function useNickname(url: string|undefined): [string|undefined, (newNickname: string) => void] {
    const [nickname, setNickname] = useState<string|undefined>(undefined);

    useEffect(() => {
        if (url === undefined) {
            return;
        }
        (async () => {
            const data = await window.electronAPI.getNickname(url);
            setNickname(data);
        })();
    }, [url]);

    const handleSetNickname = (newNickname: string) => {
        (async () => {
            if (url === undefined) {
                return;
            }
            window.electronAPI.saveNickname(url, newNickname);
            setNickname(newNickname);
        })();
    }
    
    return [nickname, handleSetNickname];
}