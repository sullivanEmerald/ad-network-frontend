import { FeedAd } from './FeedAds';

type FeedItem<T> =
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

type FeedItemsProps<T> = {
    items: FeedItem<T>[];
    renderPost: (post: T) => React.ReactNode;
};

export function FeedItems<T>({
    items,
    renderPost,
}: FeedItemsProps<T>) {
    return (
        <div className="flex flex-col">
            {items.map((item) => {
                if (item.type === 'ad-slot') {
                    return (
                        <FeedAd
                            key={item.id}
                            slotId={item.id}
                        />
                    );
                }

                return (
                    <div key={item.id}>
                        {renderPost(item.post)}
                    </div>
                );
            })}
        </div>
    );
}