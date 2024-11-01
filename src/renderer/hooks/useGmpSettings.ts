import {useEffect, useState} from "react";

export default function useGmpSettings(): [GmpSettings|undefined, (newSettings: GmpSettings) => void] {
    const [settings, setSettings] = useState<GmpSettings|undefined>(undefined);
    useEffect(() => {
        (async () => {
            setSettings(await window.electronAPI.getGmpSettings());
        })();
    }, []);

    const handleSetSettings = (newSettings: GmpSettings) => {
        (async () => {
            await window.electronAPI.saveGmpSettings(newSettings);
            setSettings(newSettings);
        })();
    }

    return [settings, handleSetSettings];
}
