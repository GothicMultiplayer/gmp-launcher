import {useEffect, useState} from "react";

export default function useAvailableVersions() {
    const [versions, setVersions] = useState<string[]>([]);
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            const data = await window.electronAPI.getAvailableVersions();
            setVersions(data);
            setLoading(false);
        })();
    }, []);

    return {versions, isLoading};
}
