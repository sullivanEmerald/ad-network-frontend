import { FeedItems } from '@/components/ads/FeedItems';
import { addFeedAdSlots } from '@/lib/feedUtils';

const posts = Array.from({ length: 40 }, (_, index) => ({
    _id: index + 1,
    title: `Post ${index + 1}`,
}));

// A short interval so several slots appear while testing; use 8 in production.
const items = addFeedAdSlots(posts, 0, 4);

// Component names must start with a capital letter (the original `ads` breaks the hooks lint rules).
export default function AdsPreviewPage() {
    return (
        <div className="mx-auto flex max-w-md flex-col gap-4 p-4">
            <h1 className="text-2xl font-bold text-white">Ads preview</h1>
            <p className="text-gray-300">
                Testing page for feed ad slots. Not part of the production application.
            </p>

            <FeedItems
                items={items}
                renderPost={(post) => (
                    <div className="rounded-lg border p-6 text-white">{post.title}</div>
                )}
            />
        </div>
    );
}