<script lang="ts">
  import { onMount } from "svelte";
  import { canvasFilter, canvasSrc, eleSensor, imgPathHeartGuide, imgPathHeartMask } from "./stores/CameraStore";
  import { tick as tickOriginal } from "../features/util";
  import { checkAndWarnIamgeIsDark, updataCanvasEffectCamera } from "../features/canvas";

  const videoAspectRatio = 1 / 1;

  let canvasFinder: HTMLCanvasElement | null = null;

  interface Props {
    canvasFinder: HTMLCanvasElement,
    canvasSrc: HTMLCanvasElement,
    imgGuidePath: string,
    sensor: HTMLVideoElement,
    canvasFilter: HTMLCanvasElement,
  }

  /**
   * 撮影用ファインダーのcanvas描画
   */
  const initEffectCamera = (props: Props) => {
    // canvasサイズセットアップ
    props.canvasSrc.width = props.sensor.clientWidth;
    props.canvasSrc.height = props.sensor.clientWidth * videoAspectRatio;
    props.canvasFinder.width = props.sensor.clientWidth;
    props.canvasFinder.height = props.sensor.clientWidth * videoAspectRatio;

    // 暗さ判定処理開始
    tickOriginal({span: 200, callback: () => {
      const ctx = props.canvasSrc.getContext("2d");
      const imageData = !ctx ? new ImageData(0, 0) : ctx.getImageData(0, 0, props.canvasSrc.width, props.canvasSrc.height)
      checkAndWarnIamgeIsDark({ imageData, darkBorder: 0.3 });
    }});

    // ハートガイド表示
    const eleHeartGuide: HTMLImageElement = document.createElement("img");
    eleHeartGuide.src = $imgPathHeartGuide;
    eleHeartGuide.onload = () => {
      updataCanvasEffectCamera({canvasSrc: props.canvasSrc, canvasDist: canvasFinder, sensor: props.sensor, effectHeart: eleHeartGuide, canvasFilter: props.canvasFilter });
    }
  }

  onMount(async () => {
    if ($eleSensor && canvasFinder) {
      canvasSrc.set(document.createElement("canvas"));
      initEffectCamera({ canvasSrc: $canvasSrc, canvasFinder, imgGuidePath: $imgPathHeartGuide, sensor: $eleSensor, canvasFilter: $canvasFilter.$$.ctx[1] });
    }
  });
</script>

<div class="CameraFinder">
  <canvas bind:this={canvasFinder} />
</div>