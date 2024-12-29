import {useEffect} from "react";
import {useNavigate} from "react-router";

export default function useShowServerListener() {
    const navigate = useNavigate();
    useEffect(() => {
        window.electronAPI.onShowServer(url => {
            navigate(`/servers/${encodeURIComponent(url)}`);
        });
        return () => {
            window.electronAPI.removeAllShowServerListeners();
        }
    }, []);
}