// uniform mat4 modelMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 projectionMatrix;

// in vec3 position;
// in vec2 uv;
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