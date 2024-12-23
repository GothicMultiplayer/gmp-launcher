/**
 * Allows only HTTPS URLs
 * @param str
 */
export function sanitizeUrl(str: string) {
    const url = URL.parse(str);
    if (url?.protocol === 'https:')
        return url.toString();
    return null;
}