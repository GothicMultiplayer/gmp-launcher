import {useEffect} from "react";

export default function useGmpSettings(): GmpSettings|undefined {
    let settings: GmpSettings|undefined = undefined;
    useEffect(() => {
        (async () => {
            settings = await window.electronAPI.getGmpSettings();
        })();
    }, []);

    return settings;
}