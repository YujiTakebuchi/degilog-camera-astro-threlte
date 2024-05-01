<script lang="ts">
  import { onMount } from "svelte";
  import { eleSensor, vidStream } from "./stores/CameraStore";

  // export let eleSensor: HTMLMediaElement | null;

  /**
   * ビデオのカメラ設定(デバイスのカメラ映像をビデオに表示)
   */
  const initVideoCamera = (vid: HTMLMediaElement) => {
    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { exact: "environment" },
        zoom: true,
      }, audio: false })
        .then((stream) => {
          vidStream.set(stream);
          if ("srcObject" in vid) {
            vid.srcObject = stream;
          } else {
            // srcObject対応してないブラウザ用フォールバック
            // TODO: sub02 完璧な代替じゃないので主要タスク終わったらそのうち直す
            // ref: https://developer.mozilla.org/ja/docs/Web/API/HTMLMediaElement/srcObject
            vid.src = URL.createObjectURL(stream);
          }
          vid.play();
          // initInputZoom({ vidStream: stream });
        })
        .catch(e => console.error(e));
  }

  onMount(() => {
    console.log("mount", "CameraSensor");
    if ($eleSensor) {
      initVideoCamera($eleSensor);
    }
  });
</script>

<video loop playsinline autoplay muted bind:this={$eleSensor} />