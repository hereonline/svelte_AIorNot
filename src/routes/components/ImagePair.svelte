<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';
    import Button from './Button.svelte';
    import LoadingSpinner from './LoadingSpinner.svelte';
    import ImageDisplay from './ImageDisplay.svelte';
    import ErrorMessage from './ErrorMessage.svelte';

    interface Image {
        id: string;
        src: string;
        isAI: boolean;
        description?: string;
    }

    const dispatch = createEventDispatcher<{
        selection: { isAI: boolean }
    }>();

   
    let loading = false;
    let error: string | null = null;
    let gameStarted = false;

    async function fetchImages(): Promise<void> {
        loading = true;
        error = null;

        try {
            const res = await fetch('../api/fetchImagePair');  
            if (!res.ok) throw new Error('Failed to load images');
            const data = await res.json();

 
        const blobPromises = data.map(async (image: Image) => {
            const proxyUrl = `/api/proxy-image?image_id=${encodeURIComponent(image.id)}`;
            console.log('Fetching image blob from proxy URL:', proxyUrl);  
            const response = await fetch(proxyUrl);
            if (!response.ok) {
                console.error('Failed to load image blob from proxy:', response.status);  
                throw new Error('Failed to load image blob');
            }

            const blob = await response.blob();  
            const blobUrl = URL.createObjectURL(blob);  
            console.log('Blob URL created:', blobUrl);  
            
            return {
                ...image,
                src: blobUrl  
            };
        });

        images = await Promise.all(blobPromises);  
        console.log('Images loaded successfully');  
    } catch (err) {
        console.error('Error fetching images:', err);  
        error = 'Failed to load images. Please try again.';
    } finally {
        loading = false;
    }
}

    function startGame(): void {
    gameStarted = true; 
    fetchImages(); 
}

export let images: Image[] = [];


  function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  $: shuffledImages = shuffleArray([...images]);

  function handleSelection(isAI: boolean) {
    dispatch('selection', { isAI });
  }
</script>

<div class="flex flex-col items-center space-y-4">
  <Button
    text={gameStarted ? 'Next' : 'Start Game'}
    disabled={loading}
    loading={loading}
    on:click={gameStarted ? fetchImages : startGame}
  />

  <ErrorMessage message={error || ''} />

  {#if loading}
    <LoadingSpinner />
  {:else if shuffledImages.length > 0}
    <div class="flex space-x-4">
      {#each shuffledImages as image, index}
        <div class="flex flex-col items-center">
          <div class=" w-64 h-64 mb-20">
          <ImageDisplay
            src={image.src}
            alt={image.description || 'Image'}
          />
        </div>
          <button
            class="bg-blue-500 flex text-white px-6 py-3 rounded-md font-semibold shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 hover:bg-blue-600 mt-20 mb-5"
            on:click={() => handleSelection(image.isAI)}
          >
            Auswählen
          </button>
        </div>
      {/each}
    </div>
  {/if}
</div>