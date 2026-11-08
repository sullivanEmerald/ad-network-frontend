import axiosInstance from '@/lib/axiosInstance';
import { ReviveAdPayload } from '../types/ad';

export async function loadNext() {
    const response = await axiosInstance.get('/ads/placements/next');
    const data = await response.data;
    return data ? data : null;
}

export async function loadNextClient() {
    const response = await fetch('/ads/placements/next', { cache: 'no-store' });
    if (!response.ok) return null;
    const data = await response.json();
    return data ? data : null;
}



