<script lang="ts">
  import { Loader } from 'lucide-svelte';

  export let text: string;
  export let disabled: boolean = false;
  export let loading: boolean = false;
  export let variant: 'primary' | 'secondary' = 'primary';
</script>

<button
  class="flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 {
    variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
      : 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500'
  } {disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}"
  {disabled}
  on:click
>
  {#if loading}
    <Loader class="w-5 h-5 mr-2 animate-spin" />
  {/if}
  {text}
</button>