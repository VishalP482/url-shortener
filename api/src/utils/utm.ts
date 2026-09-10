import { UrlUtmRecord } from "../modules/utm/utm.repository";

const UTM_PARAMS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
] as const;

type UtmParam = (typeof UTM_PARAMS)[number];

/**
 * Merge stored UTM with incoming UTM parameters.
 * Incoming parameters take precedence over stored ones.
 * Parameters are not duplicated.
 */
export function mergeUtmParams(
    storedUtm: UrlUtmRecord | null,
    incomingParams: Record<string, string | undefined>
): Record<string, string> {
    const merged: Record<string, string> = {};

    // First, add stored UTM params
    if (storedUtm) {
        if (storedUtm.utmSource) merged.utm_source = storedUtm.utmSource;
        if (storedUtm.utmMedium) merged.utm_medium = storedUtm.utmMedium;
        if (storedUtm.utmCampaign) merged.utm_campaign = storedUtm.utmCampaign;
        if (storedUtm.utmTerm) merged.utm_term = storedUtm.utmTerm;
        if (storedUtm.utmContent) merged.utm_content = storedUtm.utmContent;
    }

    // Then, override with incoming params (incoming takes precedence)
    for (const param of UTM_PARAMS) {
        const incomingValue = incomingParams[param];
        if (incomingValue !== undefined && incomingValue !== "") {
            merged[param] = incomingValue;
        }
    }

    return merged;
}

/**
 * Append UTM parameters to a destination URL while preserving existing query parameters.
 */
export function appendUtmToUrl(
    originalUrl: string,
    utmParams: Record<string, string>
): string {
    if (Object.keys(utmParams).length === 0) {
        return originalUrl;
    }

    try {
        const url = new URL(originalUrl);

        for (const [key, value] of Object.entries(utmParams)) {
            // Don't duplicate if already present
            if (!url.searchParams.has(key)) {
                url.searchParams.set(key, value);
            }
        }

        return url.toString();
    } catch {
        // If URL parsing fails, return original
        return originalUrl;
    }
}

/**
 * Extract UTM parameters from query string.
 */
export function extractUtmFromQuery(
    query: Record<string, string | undefined>
): Record<string, string | undefined> {
    const utm: Record<string, string | undefined> = {};

    for (const param of UTM_PARAMS) {
        if (query[param] !== undefined) {
            utm[param] = query[param];
        }
    }

    return utm;
}
