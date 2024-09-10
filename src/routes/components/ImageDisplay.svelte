<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { Image as ImageIcon } from 'lucide-svelte';
  import ModalPicture from './ModalPicture.svelte'


  export let src: string;
  export let alt: string;

  let imageLoaded = false;
  let hovering = false;
  let showModal = false;


  function handleImageClick() {
    showModal = true;
  }
  onMount(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      imageLoaded = true;
    };
  });
</script>

<div 
  role="button"
  tabindex={0}
  class="relative flex flex-col items-center bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
  on:mouseenter={() => hovering = true}
  on:mouseleave={() => hovering = false}
  on:click={handleImageClick}
  on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleImageClick()}
>
  <div class="w-full h-64 sm:h-80 md:h-96 relative">
    {#if imageLoaded}
      <img 
        {src} 
        {alt} 
        class="w-full h-full object-cover transition-opacity duration-300 ease-in-out" 
        in:fade={{ duration: 300 }}
      />
    {:else}
      <div class="w-full h-full flex items-center justify-center bg-gray-200">
        <ImageIcon class="w-12 h-12 text-gray-400" />
      </div>
    {/if}
  </div>
</div>

<ModalPicture
  showModal={showModal}
  on:close={() => (showModal = false)}
>
  <img src={src} alt={alt} />
</ModalPicture>
