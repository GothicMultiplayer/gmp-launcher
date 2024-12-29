export function isHttpUrlValid(str: string): boolean {
    const url = URL.parse(str);
    return url?.protocol === 'https:' || url?.protocol === 'http:';
}