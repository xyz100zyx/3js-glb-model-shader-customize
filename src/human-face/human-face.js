import {
  LineBasicMaterial,
  MeshDepthMaterial,
  MeshStandardMaterial,
  RGBADepthPacking,
} from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import beginVertexShaderChunk from "./shaders/begin-vertex-custom-shader-chunk.glsl";
import commonShaderChunk from "./shaders/common-custom-shader-chunk.glsl";
import glbDepthMaterialShaderChunk from "./shaders/glb-depth-material-custom-shader-chunk.glsl";
import beginNormalShaderChunk from "./shaders/begin-normal-shader-chunk.glsl";

/**
 * будет ссылкой на объект реальных uniforms
 * */
let glbUniforms = {
  uTime: {
    value: 0,
  },
};

/**
 * будет ссылкой на объект реальных uniforms материиала для теленей glb-модели
 * */
let glbShadowUniforms = {
  uTime: {
    value: 0,
  },
};

/**
 * фикс теней от модели
 */
const depthShaderMaterial = new MeshDepthMaterial({
  depthPacking: RGBADepthPacking,
});
const fixShadows = (model) => {
  model.customDepthMaterial = depthShaderMaterial;

  depthShaderMaterial.onBeforeCompile = (shader) => {
    glbShadowUniforms = shader.uniforms;
    glbShadowUniforms.uTime = {
      value: 0,
    };
    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      commonShaderChunk,
    );

    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      glbDepthMaterialShaderChunk,
    );
  };
};

export const humanFaceInit = async (scene) => {
  const gltfLoader = new GLTFLoader();
  const glbModel = await gltfLoader.loadAsync("glb/LeePerrySmith.glb");

  glbModel.scene.scale.setScalar(0.12);
  glbModel.scene.position.y += 0.5;
  glbModel.scene.position.z -= 0.4;

  const child = glbModel.scene.children[0];
  child.material = child.material.clone();
  child.castShadow = true;
  customizeMaterial(child.material);
  fixShadows(child);

  scene.add(glbModel.scene);
  let time = 0;
  function animate(tmstmp = 0) {
    requestAnimationFrame((t) => animate(t));

    time = tmstmp;

    updateUniformsGLB(time);
    updateUniformsGLBShadow(time);
  }

  animate();
};

function updateUniformsGLB(uTime) {
  glbUniforms.uTime.value = uTime;
  glbUniforms.needsUpdate = true;
}

function updateUniformsGLBShadow(uTime) {
  glbShadowUniforms.uTime.value = uTime;
  glbShadowUniforms.needsUpdate = true;
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
      "#include <beginnormal_vertex>",
      beginNormalShaderChunk,
    );
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      beginVertexShaderChunk,
    );
  };

  material.needsUpdate = true;
}
