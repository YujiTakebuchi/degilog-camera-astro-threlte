
import { canvasSrc } from "../components/stores/CameraStore";
import { rgb2hsv } from "./color";
import { getClosingCanvas, getClosingImage } from "./img-process";

// FUNC_AREA_S: canvas処理関数
/**
 * canvasのクローン関数
 */
interface PropsCloneCanvas {
  canvasSrc: HTMLCanvasElement;
}
export const cloneCanvas: (props: PropsCloneCanvas) => HTMLCanvasElement = ({canvasSrc}) => {
  const canvasDist: HTMLCanvasElement = document.createElement("canvas");
  canvasDist.width = canvasSrc.width;
  canvasDist.height = canvasSrc.height;
  const canvasCtxMaskOuter = canvasDist.getContext("2d");
  if (!canvasCtxMaskOuter) return canvasSrc;  // getContextで失敗したら元データのcanvasを返す
  canvasCtxMaskOuter.drawImage(canvasSrc, 0, 0);
  return canvasDist;
}

type FuncLayerCanvas = (props: { canvasSrc: HTMLCanvasElement, canvasLayered: HTMLCanvasElement}) => HTMLCanvasElement | undefined;
export const layerCanvas: FuncLayerCanvas = ({ canvasSrc, canvasLayered }) => {
  const canvasDist = cloneCanvas({canvasSrc});
  const ctxDist = canvasDist.getContext("2d");
  if (!ctxDist) return;
  ctxDist.drawImage(canvasLayered, 0, 0);
  return canvasDist;
}

interface PropsGetCanvasaMaskedCenter {
  targetCanvas: HTMLCanvasElement;
  eleImg: HTMLImageElement;
}

interface PropsGetCanvasMasked {
  canvasSrc: HTMLCanvasElement;
  posX: number;
  posY: number;
  eleImg: HTMLImageElement;
}
// 特定の画像でマスクしたcanvasのcontextを返す関数
export const getCanvasMasked: (props: PropsGetCanvasMasked) => HTMLCanvasElement | undefined = ({ canvasSrc, eleImg, posX, posY }) => {
  const context = canvasSrc.getContext("2d");
  if (!context) return;
  // マスク用の合成関数の種類を選択
  context.globalCompositeOperation = 'destination-in';
  context.drawImage(eleImg, posX, posY, eleImg.width, eleImg.height);

  return canvasSrc;
}

/**
 * 任意の画像でマスクしたimageData取得
 */
export const getCanvasMaskedCenter: (props: PropsGetCanvasaMaskedCenter) => HTMLCanvasElement | undefined = ({targetCanvas, eleImg}) => {
  // マスク処理用のcanvasの複製
  const canvasMask = cloneCanvas({canvasSrc: targetCanvas});

  // マスク用canvasのImageDataをマスク処理
  return getCanvasMasked({canvasSrc: canvasMask, posX: (canvasMask.width / 2) - (eleImg.width / 2), posY: (canvasMask.height / 2) - (eleImg.height / 2), eleImg});
}
// FUNC_AREA_E: canvas処理関数


// FUNC_AREA_S: ImageData処理関数
interface PropsGetImageDataMask {
  targetCanvas: HTMLCanvasElement;
  eleImg: HTMLImageElement;
}

interface PropsGetMaskedContextImageData {
  canvasSrc: HTMLCanvasElement;
  posX: number;
  posY: number;
  eleImg: HTMLImageElement;
}
// 特定の画像でマスクしたcanvasのcontextを返す関数
export const getMaskedContextImageData = (props: PropsGetMaskedContextImageData) => {
  const context = props.canvasSrc.getContext("2d");
  if (!context) return;
  // マスク用の合成関数の種類を選択
  context.globalCompositeOperation = 'destination-in';
  context.drawImage(props.eleImg, props.posX, props.posY, props.eleImg.width, props.eleImg.height);

  return context.getImageData(0, 0, props.canvasSrc.width, props.canvasSrc.height);
}

/**
 * 任意の画像でマスクしたimageData取得
 */
export const getImageDataMask: (props: PropsGetImageDataMask) => ImageData | undefined = ({targetCanvas, eleImg}) => {
  // マスク処理用のcanvasの複製
  const canvasMask = cloneCanvas({canvasSrc: targetCanvas});

  // マスク用canvasのImageDataをマスク処理
  return getMaskedContextImageData({canvasSrc: canvasMask, posX: (canvasMask.width / 2) - (eleImg.width / 2), posY: (canvasMask.height / 2) - (eleImg.height / 2), eleImg});
}
// FUNC_AREA_E: ImageData処理関数


// FUNC_AREA_S: 判定関数
interface PropsIsPixelTargetColorRange {
  targetObjRGB: {r: number, g: number, b: number};
}
/**
 * ピクセルの色情報が閾値の範囲内かどうか判定する関数
 */
const isPixelTargetColorRange: (props: PropsIsPixelTargetColorRange) => boolean = ({targetObjRGB}) => {
  const hsv = rgb2hsv(targetObjRGB.r, targetObjRGB.g, targetObjRGB.b);
  if (targetObjRGB.r < 50) return false;
  if (hsv.h > 10 && hsv.h < 350) return false;
  if (hsv.s < 0.335) return false;
  if (hsv.s > 70 && hsv.v > 70) false;
  return true;
};
// FUNC_AREA_E: 判定関数


// FUNC_AREA_S: 計数関数
interface PropsCountPxNumNotTranspalent {
  arrayImageData: Uint8ClampedArray
}
/**
 * 撮影した画像のうち閾値に達したピクセルの数を計数する関数
 */
export const countPxNumNotTranspalent: (props: PropsCountPxNumNotTranspalent) => number = ({ arrayImageData }) => {
  let num = 0;
  for (let i = 0; i < arrayImageData.length; i += 4) {
    if (arrayImageData[i + 3] !== 0) {
      num++;
    }
  }
  return num;
}

interface PropsCountPxNumInRangeByArray {
  arrayImageData: Uint8ClampedArray
}
interface ObjectPixelRatio {
  numerator: number;
  denominator: number;
}
/**
 * 撮影した画像のうち閾値に達したピクセルの数を計数する関数
 */
export const countPxNumInRangeByArray: (props: PropsCountPxNumInRangeByArray) => ObjectPixelRatio = ({ arrayImageData }) => {
  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < arrayImageData.length; i += 4) {
    if (arrayImageData[i + 3] !== 0) {
      denominator++;
    }
    if (isPixelTargetColorRange({targetObjRGB: {r: arrayImageData[i], g: arrayImageData[i + 1], b: arrayImageData[i + 2]}})) {
      numerator++;
    }
  }
  return {numerator, denominator};
}
// FUNC_AREA_E: 計数関数

// FUNC_AREA_S: 画像処理関数
interface PropsClipPxColorInRangeByImageDataArray {
  imageData: ImageData;
}
/**
 * 受け取ったcanvasのうち閾値の色のピクセルのみを黄色にした透過imagedataに変換
*/
export const clipPxColorInRangeByImageDataArray: (props: PropsClipPxColorInRangeByImageDataArray) => ImageData = ({ imageData }) => {
  // const arrayResult = new Array(Math.floor(arrayImageData.length / 4)).fill(null);
  const arrayImageData = imageData.data;
  const arrayResult = new Uint8ClampedArray(arrayImageData.length).fill(0);
  for (let i = 0; i < arrayImageData.length; i += 4) {
    if (isPixelTargetColorRange({targetObjRGB: {r: arrayImageData[i], g: arrayImageData[i + 1], b: arrayImageData[i + 2]}})) {
      arrayResult[i] = 255;
      arrayResult[i + 1] = 255;
      arrayResult[i + 2] = 0
      arrayResult[i + 3] = 255;
    } else {
      arrayResult[i] = 0;
      arrayResult[i + 1] = 0;
      arrayResult[i + 2] = 0
      arrayResult[i + 3] = 0;
    }
  }
  // return arrayResult;
  return new ImageData(arrayResult, imageData.width);
}
// FUNC_AREA_E: 画像処理関数


// FUNC_AREA_S: 画像処理関数
interface PropsCleanNoiseHeartByImgUrl {
  targetCanvas: HTMLCanvasElement;
  callback: Function | undefined;
}
/**
 * ハートノイズ除去フロー関数
*/
export const cleanNoiseHeartByImgUrl: (props: PropsCleanNoiseHeartByImgUrl) => HTMLCanvasElement = ({ targetCanvas, callback }) => {
  const distCanvas = getClosingCanvas({ canvasSrc: targetCanvas });
  return distCanvas;
  // const eleImg = document.createElement("img");
  // eleImg.src = targetCanvas.toDataURL("image/png");
  // eleImg.onload = () => {
  //   const imgClosing = getClosingImage({ eleImage: eleImg, targetCanvas });
  //   console.log(imgClosing);
  // }
}
// FUNC_AREA_E: 画像処理関数


// FUNC_AREA_S: html連携関数
interface PropsRenderCanvasOnHtml {
  targetEle: HTMLElement;
  targetCanvas: HTMLCanvasElement;
}
/**
 * 外側マスクの判定したピクセル数を描画する関数
*/
export const renderCanvasOnHtml: (props: PropsRenderCanvasOnHtml) => void = ({targetEle, targetCanvas}) => {
  const tmp = document.createElement(`${targetEle.tagName}`);
  tmp.appendChild(targetCanvas);
  targetEle = tmp;
}
// FUNC_AREA_E: html連携関数