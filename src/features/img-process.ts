/**
 * cvはopencv.jsで提供されている変数
 * npm対応していないためcdnで読み込んでいる。
 * tsの型も対応してないのでcv読み込んでいる行はtsエラー無視
 */
interface PropsGetClosingImage {
  eleImage: HTMLImageElement;
  targetCanvas: HTMLCanvasElement;
}
const getClosingImage: (props: PropsGetClosingImage) => HTMLCanvasElement = ({eleImage, targetCanvas}) => {
  // @ts-ignore cvはopencv.jsで提供されている変数
  if (!cv) return;
  // @ts-ignore cvはopencv.jsで提供されている変数
  const cloneCv = cv;

  let src = cloneCv.imread(eleImage);
  let dst = new cloneCv.Mat();
  const kernel = cloneCv.getStructuringElement(cloneCv.MORPH_ELLIPSE, {width: 5, height: 5});
  cloneCv.morphologyEx(src, dst, cloneCv.MORPH_CLOSE, kernel);
  cloneCv.imshow(targetCanvas, dst);

  // 解放
  src.delete();
  dst.delete();
  return dst;
}

interface PropsGetClosingCanvas {
  canvasSrc: HTMLCanvasElement;
}
const getClosingCanvas: (props: PropsGetClosingCanvas) => HTMLCanvasElement = ({ canvasSrc }) => {
  // @ts-ignore cvはopencv.jsで提供されている変数
  if (!cv) return;
  // @ts-ignore cvはopencv.jsで提供されている変数
  const cloneCv = cv;

  let src = cloneCv.imread(canvasSrc);
  let dst = new cloneCv.Mat();
  const kernel = cloneCv.getStructuringElement(cloneCv.MORPH_ELLIPSE, {width: 5, height: 5});
  cloneCv.morphologyEx(src, dst, cloneCv.MORPH_CLOSE, kernel);
  cloneCv.imshow(canvasSrc, dst);

  // 解放
  src.delete();
  dst.delete();
  return dst;
}

export { getClosingImage, getClosingCanvas };