<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import { Texture, VideoTexture } from 'three';

  import videoBaseShader from '../../features/shader/glsl/videoBase.glsl?raw'

  import vertexShader from '../../features/shader/glsl/vertex.glsl?raw'
  import { canvasSrc, eleSensor } from '../stores/CameraStore';
  // import { canvasSrc, eleSensor } from './stores/CameraStore';

  let texture: Texture | undefined;
  $: {
    const vt = new VideoTexture( $eleSensor );
    uniforms.u_tex.value = vt;
  }

  useTask(async (delta) => {
    if (!$canvasSrc) return;

    uniforms.u_time.value += delta;
  })

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
    },
    u_tex: {
      value: Texture | undefined;
    }
  }
  const uniforms: ObjectUniforms = {
    ratio: { value: 300 / 300 },
    u_resolution: {
      value: {x: 300, y: 300},
    },
    u_time: { value: 1.0 },
    u_tex: {
      value: texture
    },
  };
</script>

<T.Mesh>
  <T.PlaneGeometry
    args={[10, 10]}
  />
  <T.ShaderMaterial
    {vertexShader}
    fragmentShader={videoBaseShader}
    glslVersion={"300 es"}
    {uniforms} />
</T.Mesh>