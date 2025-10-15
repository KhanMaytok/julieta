<template>
  <RouterView />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RouterView } from "vue-router";


export default defineComponent({
  name: "app",
  components: {
    RouterView,
  },
  setup() {

  },
});
</script>
