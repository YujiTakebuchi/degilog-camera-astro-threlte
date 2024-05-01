<script lang="ts">
  import { onMount } from "svelte";
  import { eleSensor, vidStream } from "./stores/CameraStore";
  import { initCameraFilter, renderCameraFilter } from "../features/shader/cameraFilter-control";
  import { init, renderGlsl } from "../features/shader/cameraFilter-control-js";

  export let canvasFinder: HTMLCanvasElement;

  onMount(() => {
    if (!$eleSensor) return
    canvasFinder.width = $eleSensor.clientWidth;
    canvasFinder.height = $eleSensor.clientWidth * (1/1);
    // const objectsCameraFilter = initCameraFilter({targetCanvas: canvasFinder});
    // console.log(objectsCameraFilter);
    // renderCameraFilter(objectsCameraFilter);

    init();
    renderGlsl();
  })
</script>

<canvas bind:this={canvasFinder} id="moduleCanvas" />
<canvas width={300} height={300} id="myCanvas" />