<script lang="ts">
    import { onMount } from 'svelte';
  import ImagePair from './components/ImagePair.svelte';
  import ScoreCounter from './components/ScoreCounter.svelte';

  let score = 0;
  let highScore = 0;
  let totalGames = 0;

  onMount(() => {

    const storedHighScore = localStorage.getItem('highScore');
    const storedTotalGames = localStorage.getItem('totalGames');

    if (storedHighScore) {
      highScore = parseInt(storedHighScore, 10);
    }

    if (storedTotalGames) {
      totalGames = parseInt(storedTotalGames, 10);
    }
  });
  interface Image {
    id: string;
    src: string;
    isAI: boolean;
    description?: string;
  }

  let images: Image[] = [];



  /**
   * @param {CustomEvent<{ isAI: boolean }>} event
   */
   function handleSelection(event: CustomEvent<{ isAI: boolean }>) {
    const isAI = event.detail.isAI;
    const isCorrect = isAI === images[1]?.isAI;
    if (isCorrect) {
      score += 1;
    } else {
      highScore = Math.max(highScore, score);
            // Store updated highScore and totalGames in localStorage
      localStorage.setItem('highScore', highScore.toString());
      localStorage.setItem('totalGames', (totalGames + 1).toString());
      score = 0;
      totalGames += 1;
    }
  }

</script>

<main class="flex flex-col items-center justify-center pt-8">
  <h1 class="text-3xl font-bold mb-4">Which Picture is AI-generated?</h1>
  <ImagePair on:selection={handleSelection} bind:images={images} />
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
    <ScoreCounter title="Aktueller Score" score={score} />
    <ScoreCounter title="Highscore" score={highScore} />
    <ScoreCounter title="Gespielte Spiele" score={totalGames} />
  </div>

</main>
