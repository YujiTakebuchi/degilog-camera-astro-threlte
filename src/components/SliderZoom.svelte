<script lang="ts">
  export let videoStream: MediaStream | null;

  let zoomRatio: number = 1.0;

  interface PropsHandlerSlideZoom {
    videoStream: MediaStream | null
  }
  const handlerSlideZoom = async (props: PropsHandlerSlideZoom) => {
    if (!props?.videoStream) return;
    const [videoTrack] = props.videoStream.getVideoTracks();
    await videoTrack.applyConstraints({
      advanced: [{zoom: zoomRatio}],
    });
  }
</script>

<div class="SliderZoom">
  <label for="shoot-zoom">zoom</label>
  <input
    type="range"
    min={1.0}
    max={2.0}
    step={0.1}
    name="shoot-zoom"
    id="shoot-zoom"
    bind:value={zoomRatio}
    on:input={() => handlerSlideZoom({videoStream})}
  />
</div>

<style>
</style>