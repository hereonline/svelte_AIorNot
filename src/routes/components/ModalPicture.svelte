<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { Minimize2 } from 'lucide-svelte';
  
    export let showModal: boolean;
  
    let dialog: HTMLDialogElement;
    const dispatch = createEventDispatcher<{ close: void }>();
  
    $: if (dialog && showModal) dialog.showModal();
    else if (dialog && !showModal) dialog.close();
  
    function closeModal() {
      dispatch('close');
    }
  </script>
  
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
  <dialog
    bind:this={dialog}
    on:close={closeModal}
    on:click|self={() => dialog.close()}
    class="w-full max-w-lg max-h-[80vh] rounded-lg p-0 overflow-visible fixed "
  >
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div on:click|stopPropagation class="p-1 flex flex-col items-center bg-white rounded-lg">
        <button
        on:click={closeModal}
        class="absolute top-2 right-2 text-red-500 hover:text-red-700 focus:outline-none"
      >
        <Minimize2 size={24} />
      </button>
      <slot name="header" class="mb-4 text-xl font-bold" />
      <div class=" overflow-y-auto max-h-[60vh] w-full">
        <slot />
      </div>
      <!-- svelte-ignore a11y-autofocus -->
    </div>
  </dialog>
  
  <style>
    dialog::backdrop {
      background: rgba(0, 0, 0, 0.3);
      opacity: 0;
      transition: opacity 0.3s ease-out;
    }
    dialog[open]::backdrop {
    opacity: 1;
  }
    
    dialog[open] {
      animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    

    dialog[open]::backdrop {
    animation: fade 0.3s ease-out;
  }

  @keyframes fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  dialog:not([open]) {
    opacity: 0;
    transition: opacity 0.3s ease-in;
  }

  dialog:not([open])::backdrop {
    opacity: 0;
    transition: opacity 0.3s ease-in;
  }
  </style>