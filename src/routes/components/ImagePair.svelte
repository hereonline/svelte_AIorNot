<script lang="ts">
    import { createEventDispatcher } from 'svelte';
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

  let canSelectImage = true; // Neue Variable zum Verfolgen, ob eine Auswahl möglich ist
  let lastSelection: 'correct' | 'incorrect' | null = null;

  function handleSelection(isAI: boolean) {
    if (canSelectImage) { // Überprüfen, ob eine Auswahl möglich ist
      const isCorrect = isAI === images[1]?.isAI;
      lastSelection = isCorrect ? 'correct' : 'incorrect';
      dispatch('selection', { isAI });
      canSelectImage = false; // Auswahl deaktivieren, nachdem eine Auswahl getroffen wurde
    }
  }
  function resetButtons() {
    canSelectImage = true;
    lastSelection = null;
  }
</script>

<div class="flex flex-col items-center space-y-4">
  <Button
    text={gameStarted ? 'Next' : 'Start Game'}
    disabled={loading}
    loading={loading}
    on:click={gameStarted ? fetchImages : startGame}
    on:click={() => resetButtons()}
  />

  <ErrorMessage message={error || ''} />

  {#if loading}
    <LoadingSpinner />
  {:else if shuffledImages.length > 0}
    <div class="flex space-x-4">
      {#each shuffledImages as image, index}
        <div class="flex flex-col items-center">
          <div class="w-64 sm:w-80 md:w-96 lg:w-128 ">
            <ImageDisplay
            src={image.src}
            alt={image.description || 'Image'}
          />
        </div>
        <button
        class="mt-5 md:mt-10 mb-10 px-6 py-3 rounded-md font-semibold shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 {
          lastSelection === 'correct' && image.isAI
            ? 'bg-green-500 text-white hover:bg-green-600'
            : lastSelection === 'incorrect' && !image.isAI
            ? 'bg-red-500 text-white hover:bg-red-600'
            : lastSelection === 'correct' && !image.isAI
            ? 'bg-gray-500 text-white hover:bg-gray-600'
            : lastSelection === 'incorrect' && image.isAI
            ? 'bg-gray-500 text-white hover:bg-gray-600'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }"
        on:click={() => handleSelection(image.isAI)}
        disabled={!canSelectImage}
      >
        {#if lastSelection === 'correct' && image.isAI}
          Right
        {:else if lastSelection === 'incorrect' && !image.isAI}
          Wrong
        {:else}
          Select
        {/if}
      </button>
        </div>
      {/each}
    </div>
  {/if}
</div>