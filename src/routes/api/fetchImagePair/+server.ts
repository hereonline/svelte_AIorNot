import { VITE_REAL_IMAGE_API_KEY, VITE_AI_IMAGE_API_KEY, VITE_REAL_IMAGE_API_URL, VITE_AI_IMAGE_API_URL } from '$env/static/private';
import { imageCache } from '$lib/imageStore';


interface UnsplashImage {
    urls: { regular: string };
    description: string;
    alt_description: string;
}

interface Image {
    id: string;
    isAI: boolean;
    description?: string;
}



async function fetchUnsplashImageWithKey(): Promise<UnsplashImage> {
    const response = await fetch(`${VITE_REAL_IMAGE_API_URL}`, {
        headers: { 'Authorization': `Client-ID ${VITE_REAL_IMAGE_API_KEY}` }
    });
    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to fetch Unsplash image: ${errorMessage}`);
    }
    return response.json();
}

async function generateAIImageWithKey(prompt: string): Promise<string> {
    const response = await fetch(`${VITE_AI_IMAGE_API_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${VITE_AI_IMAGE_API_KEY}`
        },
        body: JSON.stringify({ prompt, n: 1, size: "512x512" })
    });
    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to generate AI image: ${errorMessage}`);
    }
    const data = await response.json();
    return data.data[0].url;
}

async function fetchImagePairWithKeys(): Promise<Image[]> {
    const unsplashImage = await fetchUnsplashImageWithKey();
    const description = unsplashImage.description || unsplashImage.alt_description || "A random image";
    const aiImageUrl = await generateAIImageWithKey(description);

    const unsplashId = Math.random().toString(36).substr(2, 9);
    const aiImageId = Math.random().toString(36).substr(2, 9);

    imageCache.set(unsplashId, unsplashImage.urls.regular);
    imageCache.set(aiImageId, aiImageUrl);

    console.log('Unsplash Image URL:', unsplashImage.urls.regular);
    console.log('AI Image URL:', aiImageUrl);

    return [
        { id: unsplashId, isAI: false, description },
        { id: aiImageId, isAI: true, description }
    ];
}

export async function GET() {
    try {
        const images = await fetchImagePairWithKeys();
        return new Response(JSON.stringify(images), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error fetching images:', error);
        return new Response('Failed to fetch images', { status: 500 });
    }
}
