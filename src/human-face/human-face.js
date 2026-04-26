import { LineBasicMaterial, MeshStandardMaterial } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import beginVertexShaderChunk from "./shaders/begin-vertex-custom-shader-chunk.glsl";
import commonShaderChunk from "./shaders/common-custom-shader-chunk.glsl";

/**
 * будет ссылкой на объект реальных uniforms 
 * */
let glbUniforms = {
  uTime: {
    value: 0,
  },
};

export const humanFaceInit = async (scene) => {
  const gltfLoader = new GLTFLoader();
  const glbModel = await gltfLoader.loadAsync("glb/LeePerrySmith.glb");

  glbModel.scene.scale.setScalar(0.12);
  glbModel.scene.position.y += 0.5;
  glbModel.scene.position.z -= 0.4;

  glbModel.scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material = child.material.map((mat) => mat.clone());
          child.material.forEach((mat) => {
            customizeMaterial(mat);
          });
        } else {
          child.material = child.material.clone();
          customizeMaterial(child.material);
        }
      }
    }
  });

  scene.add(glbModel.scene);
  let time = 0;
  function animate(tmstmp = 0) {
    requestAnimationFrame((t) => animate(t));

    time = tmstmp;

    updateUniforms(glbModel, time);
  }

  animate();
};

function updateUniforms(glbModel, uTime) {
  glbUniforms.uTime.value = uTime;
  glbUniforms.needsUpdate = true;
}

function customizeMaterial(material) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = {
      value: 0,
    };
    glbUniforms = shader.uniforms;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      commonShaderChunk,
    );
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      beginVertexShaderChunk,
    );
  };

  material.needsUpdate = true;
}
