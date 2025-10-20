<script setup lang="ts">
import { computed, useAttrs } from 'vue'

interface MainProps {
  fixed?: boolean
  fluid?: boolean
  class?: string
}

// props y attrs (para pasar cualquier otro atributo HTML)
const props = defineProps<MainProps>()
const attrs = useAttrs()

// Función para concatenar clases como cn()
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

// Computar clases dinámicas
const mainClass = computed(() =>
  cn(
    'px-4 py-6',

    props.fixed && 'flex grow flex-col overflow-hidden',

    !props.fluid &&
      '@7xl/content:mx-auto @7xl/content:w-full @7xl/content:max-w-7xl',

    props.class
  )
)
</script>

<template>
  <main
    v-bind="attrs"
    :data-layout="props.fixed ? 'fixed' : 'auto'"
    :class="mainClass"
  >
    <slot />
</main>
</template>
