import serverFetcher from "./serverFetcher";

export default async function multiServersFetcher(urls: string[]) {
    return Promise.all(urls.map(url => serverFetcher(url)).filter(a => a !== undefined));
}