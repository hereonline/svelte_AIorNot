<script lang="ts">
    export let text: string;
    export let disabled: boolean = false;
    export let loading: boolean = false;
  </script>
  
  <button
    class="bg-blue-500 text-white p-2 rounded"
    {disabled}
    on:click
  >
    {loading ? 'Loading...' : text}
  </button>