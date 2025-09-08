import * as THREE from "three";
import "./Marker.css";

export class Marker {
  constructor({
    lat,
    lon,
    radius = 15,
    camera,
    renderer,
    label = "",
    tooltipText,
    tooltipLink,
  }) {
    this.lat = lat;
    this.lon = lon;
    this.radius = radius;
    this.camera = camera;
    this.renderer = renderer;
    this.tooltipVisible = false;

    this.localPosition = this.convertLatLonToVec3(lat, lon, radius);

    this.container = document.createElement("div");
    this.container.className = "marker-container";

    this.el = document.createElement("div");
    this.el.className = "marker";
    this.el.textContent = label;

    this.tooltip = document.createElement("div");
    this.tooltip.className = "tooltip";

    const title = document.createElement("div");
    title.textContent = tooltipText || "";
    this.tooltip.appendChild(title);

    if (tooltipLink) {
      const btn = document.createElement("button");
      btn.textContent = "Button hier →";
      btn.style.padding = "6px 10px";
      btn.style.cursor = "pointer";
      btn.style.borderRadius = "6px";
      btn.style.border = "none";
      btn.style.background = "#ff0000ff";
      btn.style.color = "#fff";

      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        window.open(tooltipLink, "_blank");
      });

      this.tooltip.appendChild(btn);
    }

    this.container.appendChild(this.el);
    this.container.appendChild(this.tooltip);
    document.body.appendChild(this.container);

    this.el.addEventListener("mouseenter", () => {
      if (!this.tooltipVisible) {
        this.tooltip.style.display = "block";
      }
    });

    this.el.addEventListener("mouseleave", () => {
      if (!this.tooltipVisible) {
        this.tooltip.style.display = "none";
      }
    });

    this.el.addEventListener("click", (e) => {
      e.stopPropagation();
      this.tooltipVisible = !this.tooltipVisible;
      this.tooltip.style.display = this.tooltipVisible ? "block" : "none";
      document.body.appendChild(this.container);
    });

    document.body.addEventListener("click", () => {
      if (this.tooltipVisible) {
        this.tooltipVisible = false;
        this.tooltip.style.display = "none";
      }
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

    const cameraPos = this.camera.position;
    const planetPos = planetMesh.position;

    const markerDir = pos.clone().sub(planetPos).normalize();
    const cameraDir = cameraPos.clone().sub(planetPos).normalize();
    const dot = markerDir.dot(cameraDir);

    if (dot <= 0) {
      this.container.style.opacity = "0";
      this.container.style.visibility = "hidden";
      return;
    }

    const vector = pos.project(this.camera);
    const widthHalf = 0.5 * this.renderer.domElement.clientWidth;
    const heightHalf = 0.5 * this.renderer.domElement.clientHeight;

    const x = vector.x * widthHalf + widthHalf;
    const y = -vector.y * heightHalf + heightHalf;

    const maxVisibleDistanceSq = 60 * 60;
    const distanceSq = cameraPos.distanceToSquared(pos);

    if (distanceSq > maxVisibleDistanceSq) {
      this.container.style.opacity = "0";
      this.container.style.visibility = "hidden";
      return;
    }

    this.container.style.left = `${x}px`;
    this.container.style.top = `${y}px`;
    this.container.style.transform = `translate(-50%, -50%)`;
    this.container.style.opacity = "1";
    this.container.style.visibility = "visible";
  }

  dispose() {
    this.el.remove();
    this.container.remove();
  }
}
