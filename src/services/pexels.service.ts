const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const PEXELS_BASE_URL = "/pexels";

type PexelsPhoto = {
  id: number;
  src: {
    large?: string;
    medium?: string;
    small?: string;
    original?: string;
  };
};

export const searchPexelsImage = async (query: string): Promise<{ url: string; id: string }> => {
  if (!PEXELS_API_KEY) {
    console.warn("Pexels API key not found, using fallback");
    const fallbackUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(query)},vietnam,travel`;
    return { url: fallbackUrl, id: `fallback-${query}` };
  }

  const url = `${PEXELS_BASE_URL}/v1/search?query=${encodeURIComponent(
    `${query} Vietnam travel landmark`
  )}&per_page=1&orientation=landscape`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Pexels request failed: ${response.status}`);
    }

    const data = (await response.json()) as { photos?: PexelsPhoto[] };

    if (data.photos?.length) {
      const photo = data.photos[0];
      return {
        url: photo.src.large || photo.src.medium || photo.src.small || photo.src.original || "",
        id: photo.id.toString(),
      };
    }

    throw new Error("No photos found");
  } catch (error) {
    console.warn(`[Pexels] Error for ${query}:`, error);
    const fallbackUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(query)},vietnam,travel`;
    return { url: fallbackUrl, id: `fallback-${query}` };
  }
};