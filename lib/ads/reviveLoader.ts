/**
 * Revive's asyncjs.php guards itself with `if (!reviveAsync.hasOwnProperty(id))`,
 * so it only initialises the FIRST time it is loaded. Loading it again per slot does
 * nothing, and the extra <ins> elements are never picked up. The correct pattern is:
 * load the script once, then ask it to rescan the page via its refresh event.
 */
export type ReviveEventName = 'loaded' | 'refresh';

export const reviveEvent = (deliveryId: string, name: ReviveEventName) =>
    `revive-${deliveryId}-${name}`;

const scripts = new Map<string, Promise<void>>();

export function loadReviveScript(src: string): Promise<void> {
    const existing = scripts.get(src);
    if (existing) return existing;

    const promise = new Promise<void>((resolve, reject) => {
        const el = document.createElement('script');
        el.async = true;
        el.src = src;
        el.onload = () => resolve();
        el.onerror = () => {
            scripts.delete(src); // allow a later slot to retry
            el.remove();
            reject(new Error('Revive script failed to load (blocked or unreachable)'));
        };
        document.head.appendChild(el);
    });

    scripts.set(src, promise);
    return promise;
}

/** Makes the already-loaded Revive script scan for new, unfilled <ins> elements. */
export function requestReviveRefresh(deliveryId: string) {
    document.dispatchEvent(new CustomEvent(reviveEvent(deliveryId, 'refresh')));
}