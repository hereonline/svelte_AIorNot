<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  
    const dispatch = createEventDispatcher<{
      select: boolean;
    }>();
  
    export let src: string;
    export let alt: string;
    export let isAI: boolean;
  
    function handleClick() {
      dispatch('select', isAI);
    }
  </script>
  
  <div class="flex flex-col items-center">
    <img {src} {alt} class="w-64 h-64 object-cover" />
    <p class="text-sm mt-2">Picture</p>
    <button
      class="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      on:click={handleClick}
    >
      Choose
    </button>
  </div>