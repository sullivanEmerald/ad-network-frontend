import axiosInstance from '@/lib/axiosInstance';
export type FeedPlacement =
    | { enabled: false }
    | {
        enabled: true;
        zoneId: number;
        deliveryId: string;
        scriptUrl: string;
        width: number;
        height: number;
    };

type RawPlacement = {
    placement?: unknown;
    enabled?: unknown;
    deliveryType?: unknown;
    zoneId?: unknown;
    deliveryId?: unknown;
    asyncScriptUrl?: unknown;
    width?: unknown;
    height?: unknown;
};

const TTL_MS = 60_000;
let cached: { at: number; promise: Promise<FeedPlacement> } | null = null;

export function adsWarn(...args: unknown[]) {
    if (process.env.NODE_ENV !== 'production') console.warn('[feed-ads]', ...args);
}

/** One shared request for every slot on the page, instead of one per slot. */
export function getFeedPlacement(): Promise<FeedPlacement> {
    if (cached && Date.now() - cached.at < TTL_MS) return cached.promise;

    const entry = { at: Date.now(), promise: fetchPlacement() };
    cached = entry;
    entry.promise.catch(() => {
        if (cached === entry) cached = null; // don't cache failures
    });
    return entry.promise;
}

async function fetchPlacement(): Promise<FeedPlacement> {

    const res = await axiosInstance.get('/ads/placements/feed', {
        withCredentials: true,
        headers: { Accept: 'application/json' },
    });
    console.log('Fetched feed placement', res);

    return parsePlacement(res.data as RawPlacement);
}

function parsePlacement(raw: RawPlacement): FeedPlacement {
    if (raw.placement !== 'feed' || raw.deliveryType !== 'revive-async') {
        throw new Error('Unexpected placement payload');
    }
    if (!raw.enabled) return { enabled: false };

    const zoneId = Number(raw.zoneId);
    const width = Number(raw.width);
    const height = Number(raw.height);

    if (!Number.isInteger(zoneId) || zoneId <= 0) {
        throw new Error(`Invalid zoneId "${String(raw.zoneId)}" (is reviveZoneId stored as a number?)`);
    }
    if (typeof raw.deliveryId !== 'string' || !raw.deliveryId) {
        throw new Error('Missing deliveryId (REVIVE_DELIVERY_ID on the API)');
    }
    if (typeof raw.asyncScriptUrl !== 'string') throw new Error('Missing asyncScriptUrl');
    if (!(width > 0) || !(height > 0)) throw new Error('Missing zone width/height');

    const scriptUrl = new URL(raw.asyncScriptUrl);
    if (scriptUrl.protocol !== 'https:' && scriptUrl.protocol !== 'http:') {
        throw new Error('Unexpected Revive script protocol');
    }

    // Defence in depth: only ever load the script from the configured Revive host.
    const allowed = process.env.NEXT_PUBLIC_REVIVE_DELIVERY_BASE_URL;
    if (allowed) {
        const base = new URL(allowed);
        const expectedPath = `${base.pathname.replace(/\/$/, '')}/asyncjs.php`;
        if (scriptUrl.origin !== base.origin || scriptUrl.pathname !== expectedPath) {
            throw new Error('Unexpected Revive script URL');
        }
    } else {
        adsWarn('NEXT_PUBLIC_REVIVE_DELIVERY_BASE_URL is not set; skipping the script host allow-list check');
    }

    return {
        enabled: true,
        zoneId,
        deliveryId: raw.deliveryId,
        scriptUrl: scriptUrl.toString(),
        width,
        height,
    };
}