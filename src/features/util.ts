/**
 * sleep関数
 * @param {number} msec 待機する時間、単位はミリ秒
 * @returns {Promise} 非同期用Promise
 */
export const sleep = (msec: number): Promise<null> => new Promise((resolve) => setTimeout(resolve, msec));

/**
 * フレーム数管理関数
 */
interface PropsTick {
  span: number,
  callback: Function,
}
export const tick = async (props: PropsTick) => {
  props.callback();
  await sleep(props.span);
  requestAnimationFrame(() => tick(props));
}