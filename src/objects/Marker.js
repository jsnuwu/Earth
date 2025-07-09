import * as THREE from "three";
import "./Marker.css";

export class Marker {
  constructor({
    lat,
    lon,
    radius = 15,
    camera,
    renderer,
    label = "📍",
    tooltipText,
  }) {
    this.lat = lat;
    this.lon = lon;
    this.radius = radius;
    this.camera = camera;
    this.renderer = renderer;

    this.localPosition = this.convertLatLonToVec3(lat, lon, radius);

    this.container = document.createElement("div");
    this.container.className = "marker-container";

    this.el = document.createElement("div");
    this.el.className = "marker";
    this.el.textContent = label;

    this.tooltip = document.createElement("div");
    this.tooltip.className = "tooltip";
    this.tooltip.textContent = tooltipText || "";

    this.container.appendChild(this.el);
    this.container.appendChild(this.tooltip);
    document.body.appendChild(this.container);

    this.el.addEventListener("mouseenter", () => {
      this.tooltip.style.display = "block";
    });

    this.el.addEventListener("mouseleave", () => {
      this.tooltip.style.display = "none";
    });
  }

  convertLatLonToVec3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
  }

  update(planetMesh) {
    const pos = this.localPosition.clone();
    pos.applyQuaternion(planetMesh.quaternion);

    const cameraPos = this.camera.position.clone();
    const planetPos = planetMesh.position.clone();

    const markerDir = pos.clone().sub(planetPos).normalize();

    const cameraDir = cameraPos.clone().sub(planetPos).normalize();

    const dot = markerDir.dot(cameraDir);

    if (dot <= 0) {
      this.container.style.display = "none";
      return;
    }

    const vector = pos.project(this.camera);
    const widthHalf = 0.5 * this.renderer.domElement.clientWidth;
    const heightHalf = 0.5 * this.renderer.domElement.clientHeight;

    const x = vector.x * widthHalf + widthHalf;
    const y = -vector.y * heightHalf + heightHalf;

    const isVisible = vector.z < 1;

    const distance = cameraPos.distanceTo(pos);
    const scale = Math.min(Math.max((1 / distance) * 150, 0.4), 1.0);

    this.container.style.left = `${x}px`;
    this.container.style.top = `${y}px`;
    this.container.style.transform = `translate(-50%, -50%) scale(${scale})`;
    this.container.style.display = isVisible ? "block" : "none";
  }

  dispose() {
    this.el.remove();
    this.container.remove();
  }
}
