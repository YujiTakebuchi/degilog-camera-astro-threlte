import { cleanNoiseHeartByImgUrl, clipPxColorInRangeByImageDataArray, cloneCanvas, countPxNumNotTranspalent, getCanvasMaskedCenter, getImageDataMask } from "./canvas-control";
import { rgb2hsv } from "./color";
import type { FuncImageProcessing, PropsProgressHeart, PropsProgressHeartOverwrap, ReturnProgressHeart } from "./declare-canvas";

// FUNC_AREA_S: 撮影前処理
interface PropsCheckAndWarnIamgeIsDark {
  darkBorder: number,
  imageData: ImageData,
}
/**
 * 撮影環境の明るさ判定・警告関数
 * @param {PropsCheckAndWarnIamgeIsDark} props
 * @param {number} props.darkBorder 暗さの閾値、HSVのVの値
 * @param {ImageData} props.imageData 暗さ判定する対象のImageData
 * @returns {void}
 */
export const checkAndWarnIamgeIsDark = (props: PropsCheckAndWarnIamgeIsDark): void => {
  // 透過画像(ビデオの映像が来るまで)は処理しない
  if (props.imageData.data[3] === 0) return;
  const hsvStart = rgb2hsv(props.imageData.data[0], props.imageData.data[1], props.imageData.data[2])
  // 原点の暗さ
  if (hsvStart.v > props.darkBorder) return;
  const lastIdx = props.imageData.data.length - 1;
  const hsvLast = rgb2hsv(props.imageData.data[lastIdx - 3], props.imageData.data[lastIdx - 2], props.imageData.data[lastIdx - 1])
  // 終点の暗さ
  if (hsvLast.v > props.darkBorder) return;
  // const xLimitIdx = (imageData.width * 4) - 1;
  const centerPx = (Math.floor(props.imageData.height / 2) * props.imageData.width) + Math.floor(props.imageData.width / 2);
  const hsvCenter = rgb2hsv(props.imageData.data[centerPx * 4], props.imageData.data[lastIdx - 2], props.imageData.data[lastIdx - 1])

  if (hsvCenter.v > props.darkBorder) return;
  console.log("暗いよー；；");
}

interface PropsUpdataCanvasEffectCamera {
  canvasSrc: HTMLCanvasElement;
  canvasDist: HTMLCanvasElement;
  sensor: HTMLVideoElement;
  effectHeart: HTMLImageElement;
  canvasFilter: HTMLCanvasElement;
}
/**
 * エフェクトカメラのcanvas映像を更新し続ける関数
 */
export const updataCanvasEffectCamera = (props: PropsUpdataCanvasEffectCamera) => {
  const ctxEffectCanvasDist = props.canvasDist.getContext("2d");
  
  if (!ctxEffectCanvasDist) {}
  else {
    ctxEffectCanvasDist.globalCompositeOperation = "source-over";
    ctxEffectCanvasDist.drawImage(props.canvasSrc, 0, 0);
    ctxEffectCanvasDist.drawImage(props.canvasFilter, 0, 0);
    ctxEffectCanvasDist.globalCompositeOperation = "screen";
    ctxEffectCanvasDist.drawImage(props.effectHeart, (props.canvasDist.width / 2) - 32, (props.canvasDist.height / 2) - 31, 64, 62);
  }
  requestAnimationFrame(() => updataCanvasEffectCamera(props));
};
// FUNC_AREA_E: 撮影前処理

// FUNC_AREA_S: ハート判定処理
/**
 * ハートの計数・処理
 */
export const progressHeart: (props: PropsProgressHeartOverwrap) => ReturnProgressHeart | undefined = ({ canvasSrc, eleImg, fillStyleHeart, funcImageProcessing }) => {
  // 初期化部分
  // 判定数値
  let numerator, denominator = 0;
  // 包括レイヤー(撮像レイヤー重畳)
  const canvasMask = cloneCanvas({canvasSrc});
  const ctxMask = canvasMask.getContext("2d");
  if (!ctxMask) return;
  // ハートレイヤー
  const canvasHeartBg = cloneCanvas({canvasSrc});
  const ctxHeartBg = canvasHeartBg.getContext("2d");
  if (!ctxHeartBg) return;
  // 判定レイヤー
  let canvasProcessedImage = document.createElement("canvas");

  // canvas処理部分
  // 判定対象のエリアをマスクしてImageData化
  const maskedImageData = getImageDataMask({targetCanvas: canvasMask, eleImg: eleImg});
  if(!maskedImageData) return;
  // マスク用canvasの閾値部分色変更
  const imageDataCliped = clipPxColorInRangeByImageDataArray({ imageData: maskedImageData });
  // 背景ImageData作成
  ctxHeartBg.fillStyle = fillStyleHeart;
  ctxHeartBg.fillRect(0, 0, canvasHeartBg.width, canvasHeartBg.height);
  const canvasMaskedBg = getCanvasMaskedCenter({targetCanvas: canvasHeartBg, eleImg: eleImg});
  if(!canvasMaskedBg) return;
  // 特定色部分切り抜き仮データ作成
  const canvasMaskedHeart = cloneCanvas({canvasSrc});
  const ctxCanvasMaskedHeart = canvasMaskedHeart.getContext("2d");
  if (!ctxCanvasMaskedHeart) return;
  ctxCanvasMaskedHeart.putImageData(imageDataCliped, 0, 0);
  // 判定レイヤー確定
  canvasProcessedImage = funcImageProcessing({ canvasSrc: canvasMaskedHeart });

  // 計数部分
  // ハート部分のピクセル数計数
  denominator = countPxNumNotTranspalent({arrayImageData: maskedImageData.data});
  // 特定色部分のピクセル数計数
  const ctxProcessedImage = canvasProcessedImage.getContext("2d");
  if(!ctxProcessedImage) return;
  const imageDataProcessedImage = ctxProcessedImage.getImageData(0, 0, canvasProcessedImage.width, canvasProcessedImage.height);
  numerator = countPxNumNotTranspalent({arrayImageData: imageDataProcessedImage.data});

  // レイヤー重畳部分
  ctxMask.globalCompositeOperation = "source-over";
  // ハートレイヤー重畳
  ctxMask.drawImage(canvasMaskedBg, 0, 0);
  // 判定レイヤー重畳
  ctxMask.drawImage(canvasProcessedImage, 0, 0);

  return {canvasDist: canvasMask, objNumResult: {numerator, denominator}};
}

/**
 * 外側ハートの計数・処理
 */
export const progressOuterHeart: (props: PropsProgressHeart) => ReturnProgressHeart | undefined = ({ canvasSrc, eleImg }) => {
  const result = progressHeart({canvasSrc, eleImg, fillStyleHeart: `rgba(${[0, 0, 0, 0.4]})`, funcImageProcessing: processingImageOuter});
  return result;
}

/**
 * 内側ハートの計数・処理
 */
export const progressInnerHeart: (props: PropsProgressHeart) => ReturnProgressHeart | undefined = ({ canvasSrc, eleImg }) => {
  const result = progressHeart({canvasSrc, eleImg, fillStyleHeart: `rgba(${[255, 102, 102, 0.7]})`, funcImageProcessing: processingImageInner});
  return result;
}
// FUNC_AREA_E: ハート判定処理

/**
 * 内側ハートの画像処理関数
 */
export const processingImageOuter: FuncImageProcessing = ({ canvasSrc }) => {
  return canvasSrc;
}

/**
 * 内側ハートの画像処理関数
 */
export const processingImageInner: FuncImageProcessing = ({ canvasSrc }) => {
  const canvasDist = cloneCanvas({ canvasSrc });
  cleanNoiseHeartByImgUrl({ targetCanvas: canvasDist, callback: undefined });
  return canvasDist;
}