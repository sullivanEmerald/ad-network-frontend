export type FeedResponseItem<T> =
    | {
        type: 'post';
        id: string;
        post: T;
    }
    | {
        type: 'ad-slot';
        id: string;
        placement: 'feed';
        afterPostIndex: number;
    };

export function addFeedAdSlots<T extends { _id: unknown }>(
    posts: T[],
    absoluteStartIndex: number,
    interval = 8,
): FeedResponseItem<T>[] {
    if (!Number.isInteger(interval) || interval < 1) {
        throw new Error('Ad interval must be a positive integer');
    }

    const items: FeedResponseItem<T>[] = [];

    posts.forEach((post, index) => {
        const absoluteIndex = absoluteStartIndex + index;
        const postId = String(post._id);

        items.push({
            type: 'post',
            id: `post-${postId}`,
            post,
        });

        // Insert a slot after every interval-th organic post.
        if ((absoluteIndex + 1) % interval === 0) {
            items.push({
                type: 'ad-slot',
                id: `feed-ad-${absoluteIndex + 1}`,
                placement: 'feed',
                afterPostIndex: absoluteIndex + 1,
            });
        }
    });

    return items;
}