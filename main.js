import * as THREE from "three";
import { SceneManager } from "./src/core/SceneManager.js";
import { Camera } from "./src/core/Camera.js";
import { Renderer } from "./src/core/Renderer.js";
import { Controls } from "./src/core/Controls.js";
import { Planet } from "./src/objects/Planet.js";
import { Stars } from "./src/objects/Stars.js";
import "./src/nav/navigation.css";
import navigation from "./src/nav/navigation.html?raw";
import { MarkerManager } from "./src/core/MarkerManager.js";
import { EarthControls } from "./src/core/EarthControls.js";

document.body.insertAdjacentHTML("afterbegin", navigation);


const btnRotate = document.getElementById("btnRotation");
const btnToggleTexture = document.getElementById("btnToggleTexture");

let rotateEnabled = true;

const sceneManager = new SceneManager();
const camera = new Camera();
const renderer = new Renderer();
const planet = new Planet(
  sceneManager.getScene(),
  renderer.getRenderer().domElement,
  camera
);
const stars = new Stars(2000);
const earthControls = new EarthControls(
  planet.getMesh(),
  renderer.getRenderer().domElement
);
const controls = new Controls(
  camera.getCamera(),
  renderer.getRenderer().domElement
);

sceneManager.add(planet.getMesh());
sceneManager.add(stars.getMesh());

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(30, 10, 50);
sceneManager.add(ambientLight);
sceneManager.add(directionalLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 3.5);
sunLight.position.set(30, 0, 30);
sunLight.castShadow = true;

const moonLight = new THREE.DirectionalLight(0x77ccff, 0);
moonLight.position.set(-10, 20, 10);
moonLight.castShadow = true;

sceneManager.add(sunLight);
sceneManager.add(moonLight);

const markerManager = new MarkerManager(camera.getCamera(), renderer.getRenderer());

const bundeslandHauptstaedte = [
  { name: "Berlin", lat: 52.5200, lon: 13.4050 },
  { name: "Hamburg", lat: 53.5511, lon: 9.9937 },
  { name: "München (Bayern)", lat: 48.1351, lon: 11.5820 },
  { name: "Dresden (Sachsen)", lat: 51.0504, lon: 13.7373 },
  { name: "Stuttgart (Baden-Württemberg)", lat: 48.7758, lon: 9.1829 },
  { name: "Wiesbaden (Hessen)", lat: 50.0826, lon: 8.24 },
  { name: "Mainz (Rheinland-Pfalz)", lat: 49.9929, lon: 8.2473 },
  { name: "Düsseldorf (NRW)", lat: 51.2277, lon: 6.7735 },
  { name: "Magdeburg (Sachsen-Anhalt)", lat: 52.1205, lon: 11.6276 },
  { name: "Potsdam (Brandenburg)", lat: 52.3906, lon: 13.0645 },
  { name: "Schwerin (Mecklenburg-Vorpommern)", lat: 53.6294, lon: 11.4148 },
  { name: "Kiel (Schleswig-Holstein)", lat: 54.3233, lon: 10.1228 },
  { name: "Erfurt (Thüringen)", lat: 50.9848, lon: 11.0299 },
  { name: "Bremen", lat: 53.0793, lon: 8.8017 },
  { name: "Saarbrücken (Saarland)", lat: 49.2402, lon: 6.9969 },
];

bundeslandHauptstaedte.forEach((stadt) => {
  markerManager.addMarker({
    lat: stadt.lat,
    lon: stadt.lon,
    label: "📍",
    tooltipText: stadt.name
  });
});


btnRotate.addEventListener("click", () => {
  rotateEnabled = !rotateEnabled;
  btnRotate.textContent = rotateEnabled ? "Rotation Off" : "Rotation On";
});

btnToggleTexture.addEventListener("click", () => {
  planet.toggleTexture();
  btnToggleTexture.textContent = planet.isNight
    ? "Switch to Day"
    : "Switch to Night";
});

window.addEventListener("resize", () => {
  camera.resize();
  renderer.resize();
});

let isDragging = false;
let prevMouse = { x: 0, y: 0 };
let activeControl = null;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const domElement = renderer.getRenderer().domElement;

// --- MOUSE EVENTS ---

domElement.addEventListener("mousedown", (event) => {
  isDragging = true;
  prevMouse.x = event.clientX;
  prevMouse.y = event.clientY;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera.getCamera());
  const intersects = raycaster.intersectObject(planet.getMesh(), true);

  if (intersects.length > 0) {
    activeControl = "earth";
    controls.disable();
    earthControls.enable();
  } else {
    activeControl = "orbit";
    earthControls.disable();
    controls.enable();
  }
});

domElement.addEventListener("mouseup", () => {
  isDragging = false;
  activeControl = null;
  earthControls.disable();
  controls.enable();
});

domElement.addEventListener("mousemove", (event) => {
  planet.onMouseMove(event);

  if (!isDragging) return;

  const deltaX = event.clientX - prevMouse.x;
  const deltaY = event.clientY - prevMouse.y;

  if (activeControl === "earth") {
    planet.getMesh().rotation.y += deltaX * 0.005;
    planet.getMesh().rotation.x += deltaY * 0.005;

    const limit = Math.PI / 2;
    planet.getMesh().rotation.x = Math.max(
      -limit,
      Math.min(limit, planet.getMesh().rotation.x)
    );
  } else if (activeControl === "orbit") {
    controls.controls.rotateLeft(deltaX * 0.005);
    controls.controls.rotateUp(deltaY * 0.005);
    controls.update();
  }

  prevMouse.x = event.clientX;
  prevMouse.y = event.clientY;
});

// --- ANIMATION LOOP ---

function animate() {
  requestAnimationFrame(animate);

  if (rotateEnabled && !earthControls.isDragging) {
    planet.rotate(0.0003);
  }

  earthControls.update();
  controls.update();
  markerManager.update(planet.getMesh());

  renderer.getRenderer().render(sceneManager.getScene(), camera.getCamera());
}

animate();
