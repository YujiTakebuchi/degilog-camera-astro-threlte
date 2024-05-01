<script lang="ts">
  import { T, useFrame } from "@threlte/core";
  import fragmentShader from "../features/shader/glsl/fragment.glsl?raw";
  import vertexShader from "../features/shader/glsl/vertex.glsl?raw";

  let rotation = 0;
  useFrame(() => {
    rotation += 0.001;
    uniforms.u_time.value += 0.01;
  });

  type ObjectUniforms = {
    ratio: {
      value: number;
    };
    u_resolution: {
      value: {
        x: number;
        y: number;
      };
    };
    u_time: {
      value: number;
    };
  };
  const uniforms: ObjectUniforms = {
    ratio: { value: 1 / 1 },
    u_resolution: {
      value: { x: window.innerWidth, y: window.innerHeight },
    },
    u_time: { value: 1.0 },
  };
</script>

<T.OrthographicCamera args={[-1, 1, 1, -1, 0, -1]} />
<!-- Floor -->

<T.Mesh>
  <T.PlaneGeometry args={[2, 2]} />
  <T.ShaderMaterial
    {vertexShader}
    {fragmentShader}
    glslVersion={"300 es"}
    {uniforms}
  />
</T.Mesh>
