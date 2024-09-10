<script lang="ts">
  import { onMount } from 'svelte';
  import { Sun, Moon } from 'lucide-svelte';

  let isDarkMode = false;

  function toggleDarkMode() {
    isDarkMode = !isDarkMode;
  }

  $: if (typeof document !== 'undefined') {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  onMount(() => {
    isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
</script>

<header class="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-4 shadow-md">
  <div class="container mx-auto flex justify-between items-center">
    <h1 class="text-2xl font-bold">Header</h1>
    <button 
      on:click={toggleDarkMode}
      class="p-2 text-white hover:text-purple-200 transition-colors duration-200"
      aria-label="Toggle dark mode"
    >
      {#if isDarkMode}
        <Sun size={24} />
      {:else}
        <Moon size={24} />
      {/if}
    </button>
  </div>
</header>