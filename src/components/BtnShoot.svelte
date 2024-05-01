<script lang="ts">
  import { onMount } from "svelte";
  import { processingImageInner, progressInnerHeart, progressOuterHeart } from "../features/canvas";
  import { canvasSrc, imgPathHeartMask } from "./stores/CameraStore";
  import { cloneCanvas, countPxNumInRangeByArray } from "../features/canvas-control";

  let elePhoto: HTMLImageElement | null;
  let tmpEleImgInner: HTMLImageElement;
  let tmpEleImg: HTMLImageElement;
  let eleInner: HTMLElement;
  let eleOuter: HTMLElement;
  let eleNumInner: HTMLElement;
  let eleDenInner: HTMLElement;
  let eleNum: HTMLElement;
  let eleDen: HTMLElement;

  interface PropShootPhoto {
    canvasSrc: HTMLCanvasElement;
    elePhoto: HTMLImageElement;
  }
  const shootPhoto = (props: PropShootPhoto) => {
    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = props.canvasSrc.width;
    screenCanvas.height = props.canvasSrc.height;

    const context = screenCanvas.getContext("2d");
    if (!context) return;
    context.drawImage(props.canvasSrc, 0, 0);
    props.elePhoto.src = screenCanvas.toDataURL("image/png");
  }

  const handlerClickShoot = async () => {
    if (!$canvasSrc || !elePhoto) {
      console.error("handlerClickShoot", "撮影用要素を取得できません");
      return;
    }
    shootPhoto({canvasSrc: $canvasSrc, elePhoto });

    // 内側マスクのハート判定処理
    const objInnerHeart = await progressInnerHeart({canvasSrc: $canvasSrc, eleImg: tmpEleImgInner});
    if (!objInnerHeart) {
      console.error("handlerClickShoot", "内側判定用ハートが取得できません");
      return;
    }
    // 外側マスクのハート判定処理
    const objOuterHeart = await progressOuterHeart({canvasSrc: $canvasSrc, eleImg: tmpEleImg});
    if (!objOuterHeart) {
      console.error("handlerClickShoot", "外側判定用ハートが取得できません");
      return;
    }
    // htmlにレンダリング
    const {canvasDist: canvasDistInner, objNumResult} = objInnerHeart;
    if (eleInner.firstChild) {
      eleInner.removeChild(eleInner.firstChild);
    }
    eleInner.appendChild(canvasDistInner);

    const {canvasDist, maskedImageData} = objOuterHeart;
    if (eleOuter.firstChild) {
      eleOuter.removeChild(eleOuter.firstChild);
    }
    eleOuter.appendChild(canvasDist);
    // 対象色のピクセル数をhtmlにレンダリング
    eleNumInner.textContent = `${objNumResult.numerator}`;
    eleDenInner.textContent = `${objNumResult.denominator}`;
    const {numerator, denominator} = countPxNumInRangeByArray({arrayImageData: maskedImageData.data});
    eleNum.textContent = `${numerator}`;
    eleDen.textContent = `${denominator}`;
  }

  onMount(async () => {
    tmpEleImgInner = new Image(64, 62);
    tmpEleImg = new Image(64 * 1.4, 62 * 1.4);
    tmpEleImgInner.src = $imgPathHeartMask;
    tmpEleImg.src = $imgPathHeartMask;
  });
</script>

<div class="BtnShoot">
  <button id="shoot" class="ui-shoot--content__btn-shoot" on:click={handlerClickShoot}>撮影</button>
  <!-- FIXME: 撮影データを外部に移す -->
  <img bind:this={elePhoto} />
  <div bind:this={eleInner} />
  <p>
    <span bind:this={eleNumInner} />
    /
    <span bind:this={eleDenInner} />
  </p>
  <div bind:this={eleOuter} />
  <p>
    <span bind:this={eleNum} />
    /
    <span bind:this={eleDen} />
  </p>
  <div class="tmp" />
  <div class="tmp-ele-2" />
</div>

<style>
</style>