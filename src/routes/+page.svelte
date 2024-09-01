<script lang="ts">
  import ImagePair from './components/ImagePair.svelte';
  import ScoreCounter from './components/ScoreCounter.svelte';

  let score = 0;
  let highScore = 0;
  let totalGames = 0;


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
      score = 0;
    }
  }

</script>

<main class="flex flex-col items-center justify-center pt-8">
  <h1 class="text-3xl font-bold mb-4">Welches Bild wurde von einer KI generiert?</h1>
  <ImagePair on:selection={handleSelection} bind:images={images} />
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
    <ScoreCounter title="Aktueller Score" score={score} />
    <ScoreCounter title="Highscore" score={highScore} />
    <ScoreCounter title="Gespielte Spiele" score={totalGames} />
  </div>

</main>
