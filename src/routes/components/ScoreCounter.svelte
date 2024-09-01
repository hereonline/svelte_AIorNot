<script lang="ts">
  import { fly } from 'svelte/transition';
  import { Trophy, Zap, Hash, Cigarette } from 'lucide-svelte';

  export let title: string;
  export let score: number;

  interface IconMap {
    [key: string]: typeof Trophy | typeof Zap | typeof Hash | typeof Cigarette;
  }

  const icons: IconMap = {
    "Aktueller Score": Cigarette,
    "Highscore": Trophy,
    "Aktuelle Streak": Zap,
    "Gespielte Spiele": Hash
  };

  $: Icon = icons[title] || Hash;
</script>

<div class="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
  <div class="bg-indigo-100 p-3 rounded-full">
    <svelte:component this={Icon} class="w-6 h-6 text-indigo-600" />
  </div>
  <div>
    <h3 class="text-sm font-medium text-gray-500">{title}</h3>
    <p class="text-2xl font-semibold text-gray-900" in:fly="{{ y: 10, duration: 300 }}">
      {score}
    </p>
  </div>
</div>