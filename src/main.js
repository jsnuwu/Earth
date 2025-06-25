import * as THREE from 'three';
import { SceneManager } from './core/SceneManager.js';
import { Camera } from './core/Camera.js';
import { Renderer } from './core/Renderer.js';
import { Controls } from './core/Controls.js';
import { Planet } from './objects/Planet.js';
import { Stars } from './objects/Stars.js';
import './nav/navigation.css';
import navigation from './nav/navigation.html?raw';

// 1. Navigation einfügen, damit die Buttons im DOM sind
document.body.insertAdjacentHTML('afterbegin', navigation);

// 2. Jetzt kann man die Buttons referenzieren
const btnRotate = document.getElementById('btnRotation');
const btnToggleTexture = document.getElementById('btnToggleTexture');

let rotateEnabled = true;

// 3. Szene aufbauen
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

// 4. EventListener hinzufügen (nachdem Planet erstellt wurde!)
btnRotate.addEventListener('click', () => {
  rotateEnabled = !rotateEnabled;
  btnRotate.textContent = rotateEnabled ? 'Rotation Off' : 'Rotation On';
});

btnToggleTexture.addEventListener('click', () => {
  planet.toggleTexture();
  btnToggleTexture.textContent = planet.isNight ? 'Switch to Day' : 'Switch to Night';
});

window.addEventListener('resize', () => {
  camera.resize();
  renderer.resize();
});

function animate() {
  requestAnimationFrame(animate);

  if (rotateEnabled) {
    planet.rotate(0.0003);
  }

  controls.update();
  renderer.getRenderer().render(sceneManager.getScene(), camera.getCamera());
}

animate();
