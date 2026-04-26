import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { humanFaceInit } from "./human-face/human-face";

async function bootstrap() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111122);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.set(3, 2, 5);
  camera.lookAt(0, 0.5, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // мягкие тени
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  const oc = new OrbitControls(camera, renderer.domElement);
  oc.target.set(0, 0.5, 0);

  const gridHelper = new THREE.GridHelper(10, 20, 0x888888, 0x444444);
  scene.add(gridHelper);

  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  const sphereGeometry = new THREE.SphereGeometry(0.5, 64, 64);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xff6600,
    metalness: 0.7,
    roughness: 0.3,
    emissiveIntensity: 0.15,
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.castShadow = true;
  sphere.receiveShadow = false;
  sphere.position.set(0, 0.5, 0.8);
  scene.add(sphere);

  const planeGeometry = new THREE.PlaneGeometry(4, 4);
  const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xccccaa,
    roughness: 0.4,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);

  plane.rotation.x = -Math.PI / 2;
  plane.position.y = 0;
  plane.receiveShadow = true;

  scene.add(plane);

  const ambientLight = new THREE.AmbientLight(0x404060, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xfff5e0, 1.2);
  directionalLight.position.set(2, 3, 2);
  directionalLight.castShadow = true;

  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 6;
  directionalLight.shadow.camera.left = -3;
  directionalLight.shadow.camera.right = 3;
  directionalLight.shadow.camera.top = 3;
  directionalLight.shadow.camera.bottom = -3;

  scene.add(directionalLight);

  const dlHelper = new THREE.DirectionalLightHelper(directionalLight, 0.5);
  scene.add(dlHelper);

  const pointLight = new THREE.PointLight(0xffaa66, 0.5);
  pointLight.position.set(1, 1.5, 2);
  pointLight.castShadow = false;
  scene.add(pointLight);

  const plHelper = new THREE.PointLightHelper(pointLight, 0.3);
  scene.add(plHelper);

  const backLight = new THREE.PointLight(0x6688ff, 0.3);
  backLight.position.set(-1, 1, -1.5);
  backLight.castShadow = false;
  scene.add(backLight);

  const lightSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xffaa66, emissive: 0x442200 }),
  );
  lightSphere.position.copy(directionalLight.position);
  scene.add(lightSphere);

  await humanFaceInit(scene);

  function animate() {
    requestAnimationFrame(animate);

    oc.update();
    renderer.render(scene, camera);
  }

  animate();
}

document.addEventListener("DOMContentLoaded", bootstrap);
