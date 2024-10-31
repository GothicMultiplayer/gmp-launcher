import {useEffect, useState} from "react";

export default function useAvailableVersions() {
    const [versions, setVersions] = useState<string[]|undefined>(undefined);
    useEffect(() => {
        (async () => {
            const data = await window.electronAPI.getAvailableVersions();
            setVersions(data);
        })();
    }, []);

    return versions;
}
