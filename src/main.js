import * as THREE from 'three';
import { SceneManager } from './core/SceneManager.js';
import { Camera } from './core/Camera.js';
import { Renderer } from './core/Renderer.js';
import { Controls } from './core/Controls.js';
import { Planet } from './objects/Planet.js';
import { Atmosphere } from './objects/Atmosphere.js';
import { Stars } from './objects/Stars.js';

const sceneManager = new SceneManager();
const camera = new Camera();
const renderer = new Renderer();
const controls = new Controls(camera.getCamera(), renderer.getRenderer().domElement);

const planet = new Planet();
const atmosphere = new Atmosphere();
const stars = new Stars(2000);

sceneManager.add(planet.getMesh());
sceneManager.add(atmosphere.getMesh());
sceneManager.add(stars.getMesh());

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(30, 10, 50);
sceneManager.add(ambientLight);
sceneManager.add(directionalLight);

window.addEventListener('resize', () => {
  camera.resize();
  renderer.resize();
});

function animate() {
  requestAnimationFrame(animate);
  planet.rotate();
  atmosphere.rotate();
  controls.update();
  renderer.getRenderer().render(sceneManager.getScene(), camera.getCamera());
}
animate();


