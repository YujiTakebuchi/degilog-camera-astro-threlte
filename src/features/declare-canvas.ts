// FUNC_AREA_S: ハート判定処理
export type FuncImageProcessing = (props: {
  canvasSrc: HTMLCanvasElement;
}) => HTMLCanvasElement;

// ハート判定処理コア関数用引数型宣言
export interface PropsProgressHeart {
  /**
   * canvasSrc: 処理対象のcanvas
   */
  canvasSrc: HTMLCanvasElement;
  /**
   * eleImg: ハート画像
   */
  eleImg: HTMLImageElement;
}

// ハート判定処理関数(内側外側ごとの処理)用引数型宣言
export interface PropsProgressHeartOverwrap extends PropsProgressHeart {
  /**
   * fillStyleHeart: ハート背景色のスタイル
   */
  fillStyleHeart: string;
  /**
   * funcImageProcessing: 特定色の部分の集合にかける画像処理関数
   */
  funcImageProcessing: FuncImageProcessing;
}

// ハート判定処理関数用返り値型宣言
export interface ReturnProgressHeart {
  /**
   * canvasDist: 書き出されるcanvas, immutable
   */
  canvasDist: HTMLCanvasElement;
  /**
   * objNumResult: 特定色部分のピクセル数と判定用ハートエリアのピクセル数のオブジェクト
   */
  objNumResult: {
    /**
     * numerator: 特定色部分のピクセル数
     */
    numerator: number,
    /**
     * denominator: 判定用ハートエリアのピクセル数
     */
    denominator: number,
  }
}
// FUNC_AREA_E: ハート判定処理