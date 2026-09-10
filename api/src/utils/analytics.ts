/**
 * Privacy-conscious IP handling.
 * Stores a truncated/hashed version of the IP instead of the raw IP.
 * For IPv4, stores the first two octets (e.g., "192.168") for rough geolocation.
 * For IPv6, stores the first four groups.
 */
export function hashIp(ip: string | undefined | null): string | null {
    if (!ip) return null;

    // Simple truncation for privacy — enough for country/region approximation
    const parts = ip.split(".");
    if (parts.length === 4) {
        // IPv4: keep first two octets
        return `${parts[0]}.${parts[1]}`;
    }

    // IPv6: keep first four groups
    const ipv6Parts = ip.split(":");
    if (ipv6Parts.length >= 4) {
        return ipv6Parts.slice(0, 4).join(":");
    }

    return ip;
}

/**
 * Parse User-Agent string to extract device type and OS.
 * Returns null for unknown values.
 */
export function parseUserAgent(
    userAgent: string | undefined | null
): { deviceType: string | null; os: string | null } {
    if (!userAgent) {
        return { deviceType: null, os: null };
    }

    const ua = userAgent.toLowerCase();

    // Device type detection
    let deviceType: string | null = "desktop";

    if (
        /mobile|android|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/.test(
            ua
        )
    ) {
        deviceType = "mobile";
    } else if (/tablet|ipad|playbook|silk/.test(ua)) {
        deviceType = "tablet";
    }

    // OS detection
    let os: string | null = null;

    if (ua.includes("windows")) {
        os = "Windows";
    } else if (ua.includes("mac os x") || ua.includes("macintosh")) {
        os = "macOS";
    } else if (ua.includes("linux")) {
        os = "Linux";
    } else if (ua.includes("android")) {
        os = "Android";
    } else if (ua.includes("iphone") || ua.includes("ipad")) {
        os = "iOS";
    } else if (ua.includes("chrome os")) {
        os = "Chrome OS";
    }

    return { deviceType, os };
}

/**
 * Extract country from common proxy/CDN headers.
 * Returns null if not available.
 */
export function extractCountry(
    request: { headers: Record<string, string | undefined> }
): string | null {
    // Common headers set by CDNs/proxies
    const countryHeader =
        request.headers["cf-ipcountry"] ||
        request.headers["x-country"] ||
        request.headers["x-vercel-ip-country"] ||
        request.headers["cloudfront-viewer-country"];

    if (countryHeader && countryHeader !== "XX") {
        return countryHeader.toUpperCase();
    }

    return null;
}
