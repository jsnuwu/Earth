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


/*
Farbe	Hex-Code	Beschreibung
Rot	0xff0000	Reines Rot
Grün	0x00ff00	Reines Grün
Blau	0x0000ff	Reines Blau
Gelb	0xffff00	Rot + Grün = Gelb
Cyan	0x00ffff	Grün + Blau = Cyan
Magenta	0xff00ff	Rot + Blau = Magenta
Weiß	0xffffff	Alle Farben kombiniert
Schwarz	0x000000	Keine Farbe (dunkel)
Grau	0x808080	Mittelgrau
Orange	0xffa500	Warmes Orange
Rosa	0xff69b4	Hotpink/Rosa
Violett	0x800080	Dunkles Lila
*/