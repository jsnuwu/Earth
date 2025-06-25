import * as THREE from 'three';
import { SceneManager } from './core/SceneManager.js';
import { Camera } from './core/Camera.js';
import { Renderer } from './core/Renderer.js';
import { Controls } from './core/Controls.js';
import { Planet } from './objects/Planet.js';
import { Stars } from './objects/Stars.js';

import navigation from './nav/navigation.html?raw';

document.body.insertAdjacentHTML('afterbegin', navigation);

const btnRotate = document.getElementById('btnRotation');

let rotateEnabled = true;
btnRotate.addEventListener('click', () => {
  rotateEnabled = !rotateEnabled;
  btnRotate.textContent = rotateEnabled ? 'Rotation Off' : 'Rotation On';
});

const sceneManager = new SceneManager();
const camera = new Camera();
const renderer = new Renderer();
const controls = new Controls(camera.getCamera(), renderer.getRenderer().domElement);

const planet = new Planet(sceneManager.getScene());
const stars = new Stars(2000);

sceneManager.add(planet.getMesh());
sceneManager.add(stars.getMesh());

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
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

  if (rotateEnabled) {
    planet.rotate(0.0003);
    planet.cloudsMesh.rotation.y += 0.00035;
  }

  controls.update();
  renderer.getRenderer().render(sceneManager.getScene(), camera.getCamera());
}

animate();
