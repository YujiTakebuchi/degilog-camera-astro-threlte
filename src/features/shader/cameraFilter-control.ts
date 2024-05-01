import * as THREE from "three";
import { HashFrag, HashVert } from "./glsl/HashNoise.glsl";

type ObjectUniforms = {
  ratio: {
    value: number;
  },
  u_resolution: {
    value: {
      x: number;
      y: number;
    }
  },
  u_time: {
    value: number;
  }
}

type ObjectRenderParam = {
  width: number,
  height: number,
};

type ObjectCameraParam = {
  left: number,
  right: number,
  top: number,
  bottom: number,
  near: number,
  far: number,
}

const visitedTime = Date.now();
type FuncInitCameraFilter = (props: {
  targetCanvas: HTMLCanvasElement;
}) => PropsRenderCameraFilter;
export const initCameraFilter: FuncInitCameraFilter = ({ targetCanvas }) => {
  let isCameraInitialized = false;
  // シーンの初期化
  const scene = new THREE.Scene();

  // レンダラーの初期化
  const renderParam: ObjectRenderParam = {
    width: targetCanvas.width,
    height: targetCanvas.height,
  };

  const renderer = new THREE.WebGLRenderer({
    canvas: targetCanvas
  });
  renderer.setSize(renderParam.width, renderParam.height);

  // カメラの初期化
  const camera = new THREE.OrthographicCamera();
  const cameraParam: ObjectCameraParam = {
    left: -1,
    right: 1,
    top: 1,
    bottom: -1,
    near: 0,
    far: -1
  };
  setCamera({camera, cameraParam, renderer, renderParam, isCameraInitialized});

  const uniforms: ObjectUniforms = {
    ratio: { value: renderParam.width / renderParam.height },
    u_resolution: {
      value: new THREE.Vector2(renderParam.width, renderParam.height)
    },
    u_time: { value: 1.0 },
  };

  window.addEventListener("resize", (e) => {
    resizeHandler({camera, cameraParam, renderer, renderParam, isCameraInitialized, targetCanvas,});
  });


  const geometry = new THREE.PlaneGeometry(2, 2);

  console.log(HashVert);
  console.log(HashFrag);
  
  // シェーダーを使用する
  const material = new THREE.RawShaderMaterial({
    vertexShader: HashVert,
    fragmentShader: HashFrag,
    glslVersion: THREE.GLSL3,
    uniforms: uniforms
  });
  console.log(material);
  

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  isCameraInitialized = true;
  return {
    scene,
    camera,
    renderer,
    renderParam,
    uniforms,
  }
}
function countMilliSec() {
  const now = Date.now();
  const pastMilliSec = now - visitedTime;
  return pastMilliSec * (1/1000);
}

interface PropsObjectsSetCamera {
  camera: THREE.OrthographicCamera,
  cameraParam: ObjectCameraParam,
  renderer: THREE.WebGLRenderer,
  renderParam: ObjectRenderParam,
}
interface PropsSetCamera extends PropsObjectsSetCamera{
  isCameraInitialized: boolean,
}

interface ResizeHandler extends PropsSetCamera {
  targetCanvas: HTMLCanvasElement;
}

// リサイズ
type FuncResizeHandler = (props: ResizeHandler) => void;
const resizeHandler: FuncResizeHandler = ({camera, cameraParam, renderer, renderParam, isCameraInitialized, targetCanvas }) => {
  let timerId;
  if (timerId) clearTimeout(timerId);
  setTimeout(() => {
    renderParam.width = targetCanvas.width;
    renderParam.height = targetCanvas.height;
    setCamera({ camera, cameraParam, renderer, renderParam, isCameraInitialized });
  }, 15); // 15ミリ秒ごとに処理を実行する
}

type FuncSetCamera = (props: PropsSetCamera) => void;
const setCamera:FuncSetCamera = ({isCameraInitialized, camera, renderer, cameraParam, renderParam}) => {
  if (!isCameraInitialized) {
    // THREE.OrthographicCamera : 平行投影が適用されるカメラ
    camera = new THREE.OrthographicCamera(
      cameraParam.left,
      cameraParam.right,
      cameraParam.top,
      cameraParam.bottom,
      cameraParam.near,
      cameraParam.far
    );
  }

  camera.updateProjectionMatrix();
  renderer.setSize(renderParam.width, renderParam.height);
}

interface PropsRenderCameraFilter {
  scene: THREE.Scene,
  camera: THREE.Camera,
  uniforms: ObjectUniforms,
  renderer: THREE.WebGLRenderer,
  renderParam: ObjectRenderParam,
}
type FuncRenderCameraFilter = (props: PropsRenderCameraFilter) => void;
export const renderCameraFilter: FuncRenderCameraFilter = ({renderer, scene, camera, uniforms, renderParam}) => {
  uniforms.ratio.value = renderParam.width / renderParam.height;
  uniforms.u_resolution.value.x = renderParam.width;
  uniforms.u_resolution.value.y = renderParam.height;
  uniforms.u_time.value = countMilliSec();

  renderer.render(scene, camera);
  window.requestAnimationFrame(() => renderCameraFilter({renderer, scene, camera, uniforms, renderParam}));
}
