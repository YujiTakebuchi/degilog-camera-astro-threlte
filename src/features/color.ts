/**
 *  rgb2hsv (r, g, b)
 *  rgb2hsv (colorcode)
 */
export const rgb2hsv = (r: number, g: number, b: number) => {
  // 引数処理
  let tmp = [r, g, b];
  if (r !== void 0 && g === void 0) {
    const cc = parseInt(r.toString().replace(/[^\da-f]/ig, '').replace(/^(.)(.)(.)$/, "$1$1$2$2$3$3"), 16);
    tmp = [cc >> 16 & 0xff, cc >> 8 & 0xff, cc & 0xff];
  }
  else {
    for (let i in tmp) tmp[i] = Math.max(0, Math.min(255, Math.floor(tmp[i])));
  }
  [r, g, b] = tmp;

  // RGB to HSV 変換
  const
    v = Math.max(r, g, b), d = v - Math.min(r, g, b),
    s = v ? d / v : 0, a = [r, g, b, r, g], i = a.indexOf(v),
    h = s ? (((a[i + 1] - a[i + 2]) / d + i * 2 + 6) % 6) * 60 : 0;

  // 戻り値
  return {h, s, v: v / 255};
}