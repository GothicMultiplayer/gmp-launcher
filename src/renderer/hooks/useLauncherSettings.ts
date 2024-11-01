import {useEffect, useState} from "react";

export default function useLauncherSettings(): [LauncherSettings|undefined, (newSettings: LauncherSettings) => void] {
    const [settings, setSettings] = useState<LauncherSettings|undefined>(undefined);
    useEffect(() => {
        (async () => {
            setSettings(await window.electronAPI.getLauncherSettings());
        })();
    }, []);

    const handleSetSettings = (newSettings: LauncherSettings) => {
        (async () => {
            await window.electronAPI.saveLauncherSettings(newSettings);
            setSettings(newSettings);
        })();
    }

    return [settings, handleSetSettings];
}
