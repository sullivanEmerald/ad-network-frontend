// // app/feed/components/FeedAdsClient.tsx
// 'use client';

// import { useState } from 'react';
// import AdVideoPlayer from './AdVideoPlayer';
// import { ReviveAdPayload } from '../types/ad';
// import { loadNextClient } from '../service/adsRequests';

// export function FeedAdsClient({
//     initialAd,
// }: {
//     initialAd: ReviveAdPayload | null;
// }) {
//     const [ad, setAd] = useState<ReviveAdPayload | null>(initialAd);
//     const [loading, setLoading] = useState(false);

//     async function handleNextAd() {
//         setLoading(true);
//         try {
//             const next = await loadNextClient();
//             setAd(next);
//         } finally {
//             setLoading(false);
//         }
//     }

//     if (!ad) {
//         return (
//             <p className="p-4 text-center text-sm text-neutral-500">
//                 No ad available
//             </p>
//         );
//     }

//     return (
//         <AdVideoPlayer
//             key={ad.tracking.impression[0] ?? ad.videoUrl}
//             ad={ad}
//             onAdEnded={handleNextAd}
//         />
//     );
// }