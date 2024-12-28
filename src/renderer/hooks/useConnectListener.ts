import {useEffect} from "react";
import {useNavigate} from "react-router";

export default function useConnectListener() {
    const navigate = useNavigate();
    useEffect(() => {
        window.electronAPI.onConnect(url => {
            console.log("Connect to url", url);
            navigate(`/servers/${encodeURIComponent(url)}`);
        });
    }, []);
}