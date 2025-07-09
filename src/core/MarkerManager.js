import { Marker } from "../objects/Marker";

export class MarkerManager {
  constructor(camera, renderer) {
    this.camera = camera;
    this.renderer = renderer;
    this.markers = [];
  }

  addMarker({ lat, lon, label }) {
    const marker = new Marker({
      lat,
      lon,
      camera: this.camera,
      renderer: this.renderer,
      label: "📍",
      tooltipText: label,
    });
    this.markers.push(marker);
    return marker;
  }

  update(planetMesh) {
    this.markers.forEach((marker) => marker.update(planetMesh));
  }

  clear() {
    this.markers.forEach((marker) => marker.dispose());
    this.markers = [];
  }
}
