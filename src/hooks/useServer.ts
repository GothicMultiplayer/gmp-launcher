import useSWR from "swr";
import serverFetcher from "../libs/serverFetcher";

export default function useServer(baseUrl: string) {
    //const urls = baseUrls.map(u => `${u}/api/v1/info`);
    return useSWR(baseUrl, serverFetcher);
}