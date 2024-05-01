import * as THREE from "three";
import { HashVert, HashFrag } from "HashNoise";
// import { HashFrag, HashVert } from "../../src/features/shader/glsl/HashNoise.glsl";

let scene;
let renderer;
let camera;
let renderParam;
let isInitialized;
let uniforms;
let cameraParam;

const visitedTime = Date.now();

const eleCanvas = document.querySelector("#myCanvas");
// const ctxCanvas = eleCanvas.getContext("2d");

function init() {
  console.log(eleCanvas);
  // console.log(ctxCanvas);
  // シーンの初期化
  scene = new THREE.Scene();

  // レンダラーの初期化
  renderParam = {
    // width: document.querySelector("#myCanvasWrapper").clientWidth,
    // height: document.querySelector("#myCanvasWrapper").clientHeight
    width:300,
    height: 300
  };

  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#myCanvas"),
  });
  renderer.setSize(renderParam.width, renderParam.height);

  // カメラの初期化
  cameraParam = {
    left: -1,
    right: 1,
    top: 1,
    bottom: -1,
    near: 0,
    far: -1
  };
  setCamera();

  uniforms = {
    ratio: { value: renderParam.width / renderParam.height },
    u_resolution: {
      value: new THREE.Vector2(renderParam.width, renderParam.height)
    },
    u_time: { value: 0 },
  };

  window.addEventListener("resize", (e) => {
    resizeHandler();
  });

  const vertexShaderSource = `
    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

    in vec3 position;
    in vec2 uv;
    out vec2 vUv;

    void main() {
      vUv = uv;

      // 頂点のローカル座標をワールド座標系に変換
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);

      // ワールド座標系をカメラ座標系に変換
      vec4 cameraPosition = viewMatrix * worldPosition;

      // カメラ座標系をクリップ座標系に変換
      gl_Position = projectionMatrix * cameraPosition;
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;
    in vec2 vUv;
    uniform vec2 u_resolution;
    out vec4 fragColor;

    void main() {
      vec2 pos = gl_FragCoord.xy / u_resolution.xy;;
      vec3[4] col4 = vec3[](
        vec3(1.0, 0.0, 0.0),
        vec3(0.0, 0.0, 1.0),
        vec3(0.0, 1.0, 0.0),
        vec3(1.0, 1.0, 0.0)
      );
      
      vec3 col = mix(
        mix(col4[0], col4[1], pos.x),
        mix(col4[2], col4[3], pos.x),
        pos.y
      );
      
      fragColor = vec4(col, 1.0);
    }
    `;

  const geometry = new THREE.PlaneGeometry(2, 2);

  // シェーダーを使用する
  const material = new THREE.RawShaderMaterial({
    vertexShader: HashVert,
    fragmentShader: HashFrag,
    glslVersion: THREE.GLSL3,
    uniforms: uniforms
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  isInitialized = true;
}
function countMilliSec() {
  const now = Date.now();
  const pastMilliSec = now - visitedTime;
  return pastMilliSec * (1/1000);
}

// リサイズ
function resizeHandler() {
  let timerId;
  if (timerId) clearTimeout(timerId);
  setTimeout(() => {
    renderParam.width = 300;
    renderParam.height = 300;
    setCamera();
  }, 15); // 15ミリ秒ごとに処理を実行する
}

function setCamera() {
  if (!isInitialized) {
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

function render() {
  uniforms.ratio.value = renderParam.width / renderParam.height;
  uniforms.u_resolution.value.x = renderParam.width;
  uniforms.u_resolution.value.y = renderParam.height;
  uniforms.u_time.value = countMilliSec();

  // ctxCanvas.globalCompositeOperation = "screen";
  // console.log(renderer.getContext());

  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
}

init();
render();