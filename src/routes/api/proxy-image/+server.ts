import { error } from '@sveltejs/kit';
import { imageCache } from '$lib/imageStore';
import sharp from 'sharp';

export async function GET({ url }) {
    const imageId = url.searchParams.get('image_id');

    console.log('Proxy request received for image_id:', imageId);  

    if (!imageId) {
        console.error('No image ID provided');  
        throw error(400, 'Image ID is required');
    }

    const imageUrl = imageCache.get(imageId);
    if (!imageUrl) {
        console.error('Image not found in cache for ID:', imageId);  
        throw error(404, 'Image not found');
    }

    try {
        console.log('Fetching image from URL:', imageUrl);  
        const response = await fetch(imageUrl);

        if (!response.ok) {
            console.error('Failed to fetch image from source:', response.status);  
            throw error(response.status, 'Failed to fetch image');
        }

        const buffer = await response.arrayBuffer();
        const jpegBuffer = await sharp(Buffer.from(buffer)).jpeg().toBuffer();

        console.log('Image fetched and converted to JPEG successfully');  

        return new Response(jpegBuffer, {
            headers: {
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'public, max-age=31536000', 
            }
        });
    } catch (err) {
        console.error('Error fetching image:', err);  
        throw error(500, 'Internal Server Error');
    }
}
