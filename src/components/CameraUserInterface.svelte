<script lang="ts">
  import { onMount } from "svelte";
  import BtnShoot from "./BtnShoot.svelte";
  import SliderZoom from "./SliderZoom.svelte";
  import { vidStream } from "./stores/CameraStore";

  interface ClickHandlerProps {
    canvas: HTMLCanvasElement,
    imgGuidePath: string,
    sensor: HTMLVideoElement,
  }
  // 撮影ボタンクリック時の処理
  const handleClickShoot = (props: ClickHandlerProps) => {
  }

  onMount(async () => {
    console.log("mount", "CameraUserInterface");
    console.log("CameraUserInterface", $vidStream);
  });
</script>

<div class="CameraUserInterface">
  <div class="CameraUserInterface--content">
    <div class="CameraUserInterface--content__zoom">
      <SliderZoom videoStream={$vidStream} />
    </div>
    <div class="CameraUserInterface--content__shoot">
      <BtnShoot />
    </div>
  </div>
</div>