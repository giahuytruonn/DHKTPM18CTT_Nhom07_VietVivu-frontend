import { createClient } from 'pexels';

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

const client = PEXELS_API_KEY ? createClient(PEXELS_API_KEY) : null;

export const searchPexelsImage = async (query: string): Promise<{ url: string; id: string }> => {
    if (!client) {
        console.warn('Pexels API key not found, using fallback');
        const fallbackUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(query)},vietnam,travel`;
        return { url: fallbackUrl, id: `fallback-${query}` };
    }

    try {
        const result = await client.photos.search({
            query: `${query} Vietnam travel landmark`,
            per_page: 1,
            orientation: 'landscape',
        });

        if ('photos' in result && result.photos.length > 0) {
            const photo = result.photos[0];
            return {
                url: photo.src.large || photo.src.medium || photo.src.small,
                id: photo.id.toString(),
            };
        }

        throw new Error('No photos found');
    } catch (error) {
        console.warn(`[Pexels] Error for ${query}:`, error);
        const fallbackUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(query)},vietnam,travel`;
        return { url: fallbackUrl, id: `fallback-${query}` };
    }
};