<script lang="ts">
  import { Canvas } from "@threlte/core";
  import SceneCustom from "./SceneCustom.svelte";
  import { canvasFilter } from "./stores/CameraStore";
</script>

<Canvas bind:this={$canvasFilter} size={{width: 300, height: 300}}>
  <SceneCustom />
</Canvas>
