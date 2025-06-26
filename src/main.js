import * as THREE from 'three';
import { SceneManager } from './core/SceneManager.js';
import { Camera } from './core/Camera.js';
import { Renderer } from './core/Renderer.js';
import { Controls } from './core/Controls.js';
import { Planet } from './objects/Planet.js';
import { Stars } from './objects/Stars.js';
import './nav/navigation.css';
import navigation from './nav/navigation.html?raw';
import { MarkerManager } from './core/MarkerManager.js';

document.body.insertAdjacentHTML('afterbegin', navigation);

const btnRotate = document.getElementById('btnRotation');
const btnToggleTexture = document.getElementById('btnToggleTexture');

let rotateEnabled = true;

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

const sunLight = new THREE.DirectionalLight(0xffffff, 3.5);
sunLight.position.set(10, 20, 10);
sunLight.castShadow = true;

const moonLight = new THREE.DirectionalLight(0x77ccff, 0); 
moonLight.position.set(-10, 20, 10);
moonLight.castShadow = true;

sceneManager.add(sunLight);
sceneManager.add(moonLight);

const markerManager = new MarkerManager(camera.getCamera(), renderer.getRenderer());

markerManager.addMarker({ lat: 53.5511, lon: 9.9937, label: 'Hamburg' });
markerManager.addMarker({ lat: 49.4521, lon: 11.0767, label: 'Nürnberg' });        
markerManager.addMarker({ lat: 51.7191, lon: 8.7540, label: 'Paderborn' });      
markerManager.addMarker({ lat: 49.2330, lon: 6.9950, label: 'Saarbrücken' });    
markerManager.addMarker({ lat: 50.9271, lon: 6.9603, label: 'Köln' });             
markerManager.addMarker({ lat: 48.7758, lon: 9.1829, label: 'Stuttgart' });
markerManager.addMarker({ lat: 48.1250, lon: 11.5750, label: 'München' });
markerManager.addMarker({ lat: 52.5200, lon: 13.4050, label: 'Berlin' });
markerManager.addMarker({ lat: 52.3759, lon: 9.7320, label: 'Hannover' });        
markerManager.addMarker({ lat: 49.0069, lon: 8.4037, label: 'Karlsruhe' });
markerManager.addMarker({ lat: 54.3233, lon: 10.1228, label: 'Kiel' });
markerManager.addMarker({ lat: 49.2747, lon: 8.6457, label: 'Walldorf' });






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
  markerManager.update(planet.getMesh());
  controls.update();
  renderer.getRenderer().render(sceneManager.getScene(), camera.getCamera());
}

animate();
