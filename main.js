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
const planet = new Planet(sceneManager.getScene(), renderer.getRenderer().domElement);
const stars = new Stars(2000);
const earthControls = new EarthControls(planet.getMesh(), renderer.getRenderer().domElement);
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


const markerManager = new MarkerManager(
  camera.getCamera(),
  renderer.getRenderer()
);
/*
markerManager.addMarker({ lat: 53.5511, lon: 9.9937, label: "Hamburg" });
markerManager.addMarker({ lat: 49.4521, lon: 11.0767, label: "Nürnberg" });
markerManager.addMarker({ lat: 51.7191, lon: 8.754, label: "Paderborn" });
markerManager.addMarker({ lat: 49.233, lon: 6.995, label: "Saarbrücken" });
markerManager.addMarker({ lat: 50.9271, lon: 6.9603, label: "Köln" });
markerManager.addMarker({ lat: 48.7758, lon: 9.1829, label: "Stuttgart" });
markerManager.addMarker({ lat: 48.125, lon: 11.575, label: "München" });
markerManager.addMarker({ lat: 52.52, lon: 13.405, label: "Berlin" });
markerManager.addMarker({ lat: 52.3759, lon: 9.732, label: "Hannover" });
markerManager.addMarker({ lat: 49.0069, lon: 8.4037, label: "Karlsruhe" });
markerManager.addMarker({ lat: 54.3233, lon: 10.1228, label: "Kiel" });
markerManager.addMarker({ lat: 49.2747, lon: 8.6457, label: "Walldorf" });
*/
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

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let isDragging = false;
let prevMouse = { x: 0, y: 0 };

const domElement = renderer.getRenderer().domElement;

let activeControl = null;

domElement.addEventListener("mousedown", (event) => {
  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

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
  activeControl = null;
});


domElement.addEventListener("mousemove", (event) => {
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

window.addEventListener("mousemove", (event) => {
  planet.onMouseMove(event); 
});

domElement.addEventListener("mouseup", () => {
  isDragging = false;
  activeControl = null;
  controls.enable();
});

function animate() {
  requestAnimationFrame(animate);

  const camPos = camera.getCamera().position;
  const earthPos = planet.getMesh().position;

  if (rotateEnabled && !earthControls.isDragging) {
    planet.rotate(0.0003);
  }
  earthControls.update();
  controls.update();

  markerManager.update(planet.getMesh());

  if (activeControl !== "earth") {
    controls.update();
  }

  renderer.getRenderer().render(sceneManager.getScene(), camera.getCamera());
}

animate();
