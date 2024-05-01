export const initCollapse = () => {
  const eleCollapse = document.querySelector(".collapse");
  const eleCollapseBtn = document.querySelector(".collapse__btn");
  eleCollapseBtn.addEventListener("click", () => {
    const isOpen = eleCollapse.getAttribute("area-hidden");
    isOpen === "true" ? eleCollapse.setAttribute("area-hidden", "false") : eleCollapse.setAttribute("area-hidden", "true");
  });
}

/**
 * canvas描画関数
 */
export const renderCanvasEle = ({ targetEle, renderCanvas, eleId }) => {
  renderCanvas.id = eleId;
  targetEle.appendChild(renderCanvas);
}