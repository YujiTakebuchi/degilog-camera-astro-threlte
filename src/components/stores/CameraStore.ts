import { writable, type Writable } from 'svelte/store';

// カメラパーツ要素
export const eleSensor: Writable<HTMLVideoElement> | Writable<null> = writable(null);
export const canvasSrc: Writable<HTMLCanvasElement> | Writable<null> = writable(null);
export const canvasFilter = writable(null);

// 映像データ
export const vidStream: Writable<MediaStream> | Writable<null> = writable(null);

// 撮影ガイド用画像
export const imgPathHeartGuide = writable("/assets/img/ico-heart-guide_a.svg");
export const imgPathHeartMask = writable("/assets/img/ico-heart-guide_a-mask.svg");