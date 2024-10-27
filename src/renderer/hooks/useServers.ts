import useSWR from "swr";
import multiServersFetcher from "../libs/multiServersFetcher";

export default function useServers(baseUrls: string[]) {
    //const urls = baseUrls.map(u => `${u}/api/v1/servers`);
    return useSWR(baseUrls, multiServersFetcher);
}